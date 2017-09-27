import debounce from 'lodash-es/debounce.js'


/**
 * @typedef {number} x
 * @typedef {number} y
 * @typedef {number} width
 * @typedef {number} height
 * @typedef {[x, y, width, height]} Rect
 * @typedef {number} offset
 * @typedef {Node} ParaNode
 * @typedef {number} paraNumber
 * @typedef {[offset, offset, ParaNode, paraNumber]} Range
 * @typedef {Rect[]} RectList
 * @typedef {Range[]} RangeList
 */

/** @const {string} HIGHLIGHT_COLOR */

const HIGHLIGHT_COLOR = 'skyblue'

const WRAPPER_CLASS = 'fluor-editor'
const EDITOR_CLASS = 'fluor-editor_editor'
const CANVAS_CLASS = 'fluor-editor_canvas'

/** @const {Range} range */

const range = document.createRange()

/**
 * @param {Node} startNode
 * @param {offset} startOffset
 * @param {Node} stopNode
 * @param {offset} stopOffset
 * @return {ClientRectList}
 */

function getClientRects (startNode, startOffset, stopNode, stopOffset) {
    range.setStart(startNode, startOffset)
    range.setEnd(stopNode, stopOffset)
    const clientRectList = range.getClientRects()
    range.detach()
    return clientRectList
}

class Editor {
    /**
     * @param {string} text
     * @return {ParaNode}
     */

    static createParaNode (text) {
        const paraNode = document.createElement('div')
        if (text) {
            paraNode.textContent = text
        } else {
            const br = document.createElement('br')
            paraNode.appendChild(br)
        }
        return paraNode
    }

    /**
     * @param {string|HTMLElement} selector
     * @param {object} [config = {}]
     * @property {number} [config.color = HIGHLIGHT_COLOR]
     */

    constructor (selector, {color = HIGHLIGHT_COLOR} = {}) {
        /** @type {any} */
        const root = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector
        this._create(root)

        this.ctx = this.canvas.getContext('2d')
        this.config = {color}
        this.rect = [0, 0, 0, 0]
        this._paintedParaRanges = null
        this._paintedParaRects = null

        this._listen()
        this.resize()
    }

    get content () {
        return this.editor.innerText
    }
    set content (value) {
        const {content, editor} = this
        if (value === content) {
            return
        }
        editor.innerHTML = ''
        const paraContentList = String(value).split('\n')
        for (const text of paraContentList) {
            const paraNode = Editor.createParaNode(text)
            editor.appendChild(paraNode)
        }
    }

    get _paraNodes () {
        return this.editor.childNodes
    }

    /**
     * @param {HTMLElement} root
     */

    _create (root) {
        root.classList.add(WRAPPER_CLASS)

        const canvas = document.createElement('canvas')
        this.canvas = canvas
        canvas.classList.add(CANVAS_CLASS)

        const editor = document.createElement('div')
        this.editor = editor
        editor.classList.add(EDITOR_CLASS)
        editor.contentEditable = 'true'
        this.content = root.textContent
        const {
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
        } = window.getComputedStyle(root)
        Object.assign(editor.style, {
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
        })

        root.innerHTML = ''
        Object.assign(root.style, {
            padding: '0px',
            overflow: 'initial'
        })
        root.appendChild(canvas)
        root.appendChild(editor)
    }

    _listen () {
        /** @type {any} */
        this._repaint = debounce(() => {
            if (this._paintedParaRanges) {
                this._paintedParaRects = this._drawRanges(this._paintedParaRanges)
            }
        }, 200)
        this._resizeListener = () => {
            this.resize()
            this._repaint()
        }
        window.addEventListener('resize', this._resizeListener)

        this._scrollListener = event => {
            this.rect[0] -= window.scrollX
            this.rect[1] -= window.scrollY
        }
        window.addEventListener('scroll', this._scrollListener)

        this._editorScrollListener = event => {
            if (!this._paintedParaRects) {
                return
            }
            this.refresh()
            this._drawRects(this._paintedParaRects)
        }
        this.editor.addEventListener('scroll', this._editorScrollListener)

        this._editorPasteListener = event => {
            event.preventDefault()
            const text = event.clipboardData.getData('text/plain')
            document.execCommand('insertText', false, text)
        }
        this.editor.addEventListener('paste', this._editorPasteListener)

        const paraContentObserverConfig = {
            subtree: true,
            characterData: true
        }
        const paraContentSubscriber = mutations => {
            let paraNode
            for (const {type, target} of mutations) {
                paraNode = target.parentElement
                if (type !== 'characterData' || !paraNode) {
                    continue
                }
                paraNode['_dirty'] = true
            }
        }
        this._paraContentObserver = new MutationObserver(paraContentSubscriber)
        this._paraContentObserver.observe(this.editor, paraContentObserverConfig)

        const paraNodesObserverConfig = {
            childList: true
        }
        const paraNodesSubscriber = mutations => {
            const mutation = mutations[mutations.length - 1]
            if (mutation.type !== 'childList') {
                return
            }
            let paraNode
            if (mutation.addedNodes.length !== 0) {
                paraNode = mutation.previousSibling
            } else if (mutation.removedNodes.length !== 0) {
                paraNode = mutation.nextSibling
            } else {
                return
            }
            while (paraNode) {
                paraNode['_dirty'] = true
                paraNode = paraNode.nextSibling
            }
        }
        this._paraNodesObserver = new MutationObserver(paraNodesSubscriber)
        this._paraNodesObserver.observe(this.editor, paraNodesObserverConfig)
    }

    _unlisten () {
        window.removeEventListener('resize', this._resizeListener)
        this._resizeListener = null
        this._repaint.cancel()
        window.removeEventListener('scroll', this._scrollListener)
        this._scrollListener = null
        this.editor.removeEventListener('scroll', this._editorScrollListener)
        this._editorScrollListener = null
        this.editor.removeEventListener('paste', this._editorPasteListener)
        this._editorPasteListener = null
        this._paraContentObserver.disconnect()
        this._paraContentObserver = null
    }

    resize () {
        const {canvas} = this
        const {width: oldWidth, height: oldHeight} = canvas
        const newRect = canvas.getBoundingClientRect()
        const {width, height, top, left} = newRect
        if (width === oldWidth && height === oldHeight) {
            return
        }
        canvas.width = width
        canvas.height = height
        const {ctx, config: {color}, rect} = this
        ctx.fillStyle = color
        rect[0] = left
        rect[1] = top
        rect[2] = width
        rect[3] = height
        const paraNodes = this._paraNodes
        for (const paraNode of paraNodes) {
            paraNode['_dirty'] = true
        }
    }

    destroy () {
        this._unlisten()
        this._paintedParaRects = null
        this._paintedParaRanges = null
        this.rect = null
        this.config = null
        this.ctx = null
        this.canvas = null
        this.editor = null
    }

    /**
     * Convert clientRect to editoRect
     * @param {Rect} clientRect
     * @return {Rect}
     */

    rectClientToEditor (clientRect) {
        const [clientLeft, clientTop] = clientRect
        const [originLeft, originTop] = this.rect
        return [
            clientLeft - originLeft,
            clientTop - originTop,
            clientRect[2],
            clientRect[3]
        ]
    }

    /**
     * Convert editorRect to canvasRect
     * @param {Rect} editorRect
     * @return {Rect}
     */

    rectEditorToCanvas (editorRect) {
        const [editorLeft, editorTop] = editorRect
        const {scrollLeft, scrollTop} = this.editor
        return [
            editorLeft - scrollLeft,
            editorTop - scrollTop,
            editorRect[2],
            editorRect[3]
        ]
    }

    /**
     * Convert clientRect to canvasRect
     * @param {Rect} editorRect
     * @return {Rect}
     */

    rectClientToCanvas (clientRect) {
        const [clientLeft, clientTop] = clientRect
        const [originLeft, originTop] = this.rect
        const {scrollTop, scrollLeft} = this.editor
        return [
            clientLeft - originLeft - scrollLeft,
            clientTop - originTop - scrollTop,
            clientRect[2],
            clientRect[3]
        ]
    }

    /**
     * @param {ParaNode} paraNode
     * @param {offset} startOffset
     * @param {offset} stopOffset
     * @return {RectList}
     */

    _getParaRects (paraNode, startOffset, stopOffset) {
        const key = `${startOffset}:${stopOffset}`
        if (paraNode['_dirty'] || !paraNode['_cache']) {
            paraNode['_dirty'] = false
            paraNode['_cache'] = {}
        }
        const caches = paraNode['_cache']
        if (caches[key]) {
            return caches[key]
        }
        const textNode = paraNode.firstChild
        const clientRectList = getClientRects(
            textNode,
            startOffset,
            textNode,
            stopOffset
        )
        const {scrollLeft, scrollTop} = this.editor
        /** @type {RectList} */
        const rectList = []
        for (let i = 0, l = clientRectList.length, clientRect; i < l; i++) {
            clientRect = clientRectList.item(i)
            rectList.push([
                clientRect.left + scrollLeft,
                clientRect.top + scrollTop,
                clientRect.width,
                clientRect.height
            ])
        }
        caches[key] = rectList
        return rectList
    }

    /**
     * @param {offset} start
     * @param {offset} stop
     * @return {RangeList}
     */

    _getParaRanges (start, stop) {
        /** @type {RangeList} */
        const rangeList = []
        const paraNodes = this._paraNodes
        let paraOffset = start
        let begined = false
        let paraNode, paraLength, startOffset
        for (let i = 0, l = paraNodes.length; i < l && paraOffset >= 0; (i++, paraOffset--)) {
            paraNode = paraNodes[i]
            paraLength = paraNode.textContent.length
            if (begined === false) {
                if (paraOffset >= paraLength) {
                    paraOffset -= paraLength
                    continue
                }
                begined = true
                startOffset = paraOffset
                if (typeof stop === 'number') {
                    paraOffset += stop - start
                    if (paraOffset >= paraLength) {
                        rangeList.push([startOffset, paraLength, paraNode, i])
                        paraOffset -= paraLength
                        continue
                    }
                } else {
                    paraOffset = undefined
                }
                rangeList.push([startOffset, paraOffset, paraNode, i])
                break
            } else {
                startOffset = 0
                if (paraOffset >= paraLength) {
                    rangeList.push([startOffset, paraLength, paraNode, i])
                    paraOffset -= paraLength
                    paraOffset -= 1
                    continue
                }
                rangeList.push([startOffset, paraOffset, paraNode, i])
                break
            }
        }
        return rangeList
    }

    refresh () {
        this.canvas.width = this.canvas.width
        this.ctx.fillStyle = this.config.color
    }

    clear () {
        const {canvas} = this
        const newRect = canvas.getBoundingClientRect()
        const {width, height, top, left} = newRect
        canvas.width = width
        canvas.height = height
        const {ctx, config: {color}, rect} = this
        ctx.fillStyle = color
        rect[0] = left
        rect[1] = top
        rect[2] = width
        rect[3] = height
        const paraNodes = this._paraNodes
        for (const paraNode of paraNodes) {
            paraNode['_dirty'] = false
            paraNode['_cache'] = {}
        }
        this._paintedParaRects = null
        this._paintedParaRanges = null
    }

    _draw (canvasRect) {
        this.ctx.fillRect(
            canvasRect[0] + 1,
            canvasRect[1],
            canvasRect[2] - 1,
            canvasRect[3]
        )
    }

    /**
     * @param {RectList} paraRectList
     */

    _drawRects (paraRectList) {
        let rect, canvasRect
        for (rect of paraRectList) {
            canvasRect = this.rectEditorToCanvas(rect)
            this._draw(canvasRect)
        }
    }

    /**
     * @param {RangeList} paraRangeList
     * @return {RectList}
     */

    _drawRanges (paraRangeList) {
        const rangeRects = []
        let rects, editorRect, canvasRect
        for (const [startOffset, stopOffset, paraNode] of paraRangeList) {
            rects = this._getParaRects(
                paraNode,
                startOffset,
                stopOffset === undefined ? startOffset + 1 : stopOffset
            )
            for (const [left, top, width, height] of rects) {
                editorRect = this.rectClientToEditor([left, top, width, height])
                rangeRects.push(editorRect)
                canvasRect = this.rectEditorToCanvas(editorRect)
                this._draw(canvasRect)
            }
        }
        return rangeRects
    }

    /**
     * @param {...offset} args
     */

    draw (...args) {
        this.refresh()
        this._paintedParaRanges = []
        this._paintedParaRects = []
        const l = args.length
        let i = 0
        let start, stop, ranges, rects
        while (i < l) {
            start = args[i++]
            stop = args[i++]
            ranges = this._getParaRanges(start, stop)
            this._paintedParaRanges.push(...ranges)
            rects = this._drawRanges(ranges)
            this._paintedParaRects.push(...rects)
        }
    }
}


export default Editor
