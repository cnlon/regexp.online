import getClientRects from './getClientRects.js'
import createParaNode from './createParaNode.js'
import Range from './Range.js'
import Point from './Point.js'
import Rect from './Rect.js'

const HIGHLIGHT_COLOR = 'skyblue'

const WRAPPER_CLASS = 'fluor-editor'
const EDITOR_CLASS = 'fluor-editor_editor'
const CANVAS_CLASS = 'fluor-editor_canvas'
const LINEBREAK_CLASS = 'fluor-editor_editor--linebreak'
const LINE_FEED = /\r\n|\n/

const rangeRectsCacheMap = new WeakMap()
const scrollIntoViewIfNeeded = Element.prototype['scrollIntoViewIfNeeded']

class Editor {
    constructor (selector, {
        color = HIGHLIGHT_COLOR,
        linebreak = true,
        windowAutoResize = true,
        windowAutoScroll = true,
    } = {}) {
        this.config = {
            color,
            linebreak,
            windowAutoResize,
            windowAutoScroll,
        }

        const root = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector
        root.classList.add(WRAPPER_CLASS)

        this.canvas = document.createElement('canvas')
        this.canvas.classList.add(CANVAS_CLASS)

        this.editor = document.createElement('div')
        this.editor.classList.add(EDITOR_CLASS)
        if (linebreak) {
            this.editor.classList.add(LINEBREAK_CLASS)
        }
        this.editor.contentEditable = 'true'
        this.content = root.innerText
        const {
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
        } = window.getComputedStyle(root)
        Object.assign(this.editor.style, {
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
        root.appendChild(this.canvas)
        root.appendChild(this.editor)

        this.context = this.canvas.getContext('2d')
        this.scrollOrigin = new Point(0, 0)
        this.paintedRanges = null
        this.paintedRects = null

        this._addListeners()
        this.resize()
    }

    destroy () {
        this._removeListeners()
        this.paintedRects = null
        this.paintedRanges = null
        this.scrollOrigin = null
        this.context = null
        this.canvas = null
        this.editor = null
        this.config = null
    }

    get content () {
        return this.editor.innerText
    }
    set content (value) {
        const {content, editor} = this
        if (value === content) {
            return
        }
        const paraNodes = this.editor.childNodes
        const paraContents = String(value).split(LINE_FEED)
        const l = paraContents.length
        if (l < paraNodes.length) {
            const lastNode = paraNodes.item(l - 1)
            let nextSiblingNode
            while ((nextSiblingNode = lastNode.nextSibling)) {
                editor.removeChild(nextSiblingNode)
            }
        }
        for (let i = 0, paraNode, text; i < l; i++) {
            paraNode = paraNodes.item(i)
            text = paraContents[i]
            if (paraNode) {
                if (paraNode.textContent === text) {
                    continue
                }
                paraNode.textContent = text
                continue
            }
            paraNode = createParaNode(text)
            editor.appendChild(paraNode)
        }
    }

    _addListeners () {
        this._editorScrollListener = () => this.redrawRects()
        this.editor.addEventListener('scroll', this._editorScrollListener)

        this._editorPasteListener = event => {
            event.preventDefault()
            const text = event.clipboardData.getData('text/plain')
            document.execCommand('insertText', false, text)
            this.scrollCaretIntoViewIfNeeded()
        }
        this.editor.addEventListener('paste', this._editorPasteListener)

        this._paraContentObserver = new MutationObserver(mutations => {
            for (let i = 0, l = mutations.length, mutation, type, paraNode; i < l; i++) {
                mutation = mutations[i]
                type = mutation.type
                if (type !== 'characterData') {
                    continue
                }
                paraNode = mutation.target.parentElement
                if (!paraNode) {
                    continue
                }
                rangeRectsCacheMap.delete(paraNode)
            }
        })
        this._paraContentObserver.observe(this.editor, {
            characterData: true,
            subtree: true,
        })

        if (this.config.windowAutoResize) {
            this._windowResizeListener = () => this.resize()
            window.addEventListener('resize', this._windowResizeListener)
        }
        if (this.config.windowAutoScroll) {
            this._windowScrollListener = () => {
                const {pageXOffset, pageYOffset} = window
                this.scrollOrigin.move(pageXOffset, pageYOffset)
            }
            window.addEventListener('scroll', this._windowScrollListener)
        }
    }

    _removeListeners () {
        this.editor.removeEventListener('scroll', this._editorScrollListener)
        this._editorScrollListener = null
        this.editor.removeEventListener('paste', this._editorPasteListener)
        this._editorPasteListener = null
        this._paraContentObserver.disconnect()
        this._paraContentObserver = null

        if (this._windowResizeListener) {
            window.removeEventListener('resize', this._windowResizeListener)
            this._windowResizeListener = null
        }
        if (this._windowScrollListener) {
            window.removeEventListener('scroll', this._windowScrollListener)
            this._windowScrollListener = null
        }
    }

    _getRangeRects (start, stop, paraNode) {
        const key = `${start}:${stop}`
        if (!rangeRectsCacheMap.has(paraNode)) {
            rangeRectsCacheMap.set(paraNode, Object.create(null))
        }
        const cache = rangeRectsCacheMap.get(paraNode)
        if (cache[key]) {
            return cache[key]
        }
        const textNode = paraNode.firstChild
        const clientRectList = getClientRects(
            textNode,
            start,
            textNode,
            stop
        )
        const {scrollLeft, scrollTop} = this.editor
        const {x: scrollOriginX, y: scrollOriginY} = this.scrollOrigin
        const rectList = []
        for (let i = 0, l = clientRectList.length, clientRect; i < l; i++) {
            clientRect = clientRectList.item(i)
            rectList.push(new Rect(
                clientRect.left + scrollLeft - scrollOriginX,
                clientRect.top + scrollTop - scrollOriginY,
                clientRect.width,
                clientRect.height
            ))
        }
        cache[key] = rectList
        return rectList
    }

    _getParaRanges (start, stop) {
        const rangeList = []
        const paraNodes = this.editor.childNodes
        let paraOffset = start
        let begined = false
        let paraNode, paraLength, startOffset
        for (let i = 0, l = paraNodes.length; i < l && paraOffset >= 0; (i++ , paraOffset--)) {
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
                        rangeList.push(new Range(
                            startOffset,
                            paraLength,
                            paraNode,
                            i
                        ))
                        paraOffset -= paraLength
                        continue
                    }
                } else {
                    paraOffset = undefined
                }
                rangeList.push(new Range(
                    startOffset,
                    paraOffset,
                    paraNode,
                    i
                ))
                break
            } else {
                startOffset = 0
                if (paraOffset >= paraLength) {
                    rangeList.push(new Range(
                        startOffset,
                        paraLength,
                        paraNode,
                        i
                    ))
                    paraOffset -= paraLength
                    paraOffset -= 1
                    continue
                }
                rangeList.push(new Range(
                    startOffset,
                    paraOffset,
                    paraNode,
                    i
                ))
                break
            }
        }
        return rangeList
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
        const {context, config: {color}, scrollOrigin} = this
        context.fillStyle = color
        scrollOrigin.moveTo(left, top)
        const paraNodes = this.editor.childNodes
        for (let i = 0, l = paraNodes.length, paraNode; i < l; i++) {
            paraNode = paraNodes[i]
            rangeRectsCacheMap.delete(paraNode)
        }
        this.redrawRanges()
    }

    clear () {
        this.canvas.width = this.canvas.width
        this.context.fillStyle = this.config.color
    }

    scrollCaretIntoViewIfNeeded () {
        if (!scrollIntoViewIfNeeded) {
            return
        }
        if (this._scrollCaretIntoViewIfNeededTimer) {
            clearTimeout(this._scrollCaretIntoViewIfNeededTimer)
        }
        this._scrollCaretIntoViewIfNeededTimer = setTimeout(() => {
            this._scrollCaretIntoViewIfNeededTimer = null
            const selection = window.getSelection()
            let paraNode = selection.focusNode
            if (paraNode.parentElement !== this.editor) {
                paraNode = paraNode.parentElement
                if (paraNode.parentElement !== this.editor) {
                    return
                }
            }
            scrollIntoViewIfNeeded.call(paraNode)
        })
    }

    drawRect (rect) {
        const {scrollLeft, scrollTop} = this.editor
        this.context.fillRect(
            rect.x - scrollLeft + 1,
            rect.y - scrollTop,
            rect.w - 1,
            rect.h
        )
    }

    draw (...args) {
        this.clear()
        this.paintedRanges = []
        this.paintedRects = []
        const l = args.length
        let i = 0
        let ranges
        while (i < l) {
            ranges = this._getParaRanges(args[i++], args[i++])
            for (let j = 0, m = ranges.length, range, rects; j < m; j++) {
                range = ranges[j]
                this.paintedRanges.push(range)
                rects = this._getRangeRects(range.x, range.y, range.n)
                for (let k = 0, n = rects.length, rect; k < n; k++) {
                    rect = rects[k]
                    this.paintedRects.push(rect)
                    this.drawRect(rect)
                }
            }
        }
    }

    redrawRects () {
        if (!this.paintedRects) {
            return
        }
        this.clear()
        for (let i = 0, l = this.paintedRects.length, rect; i < l; i++) {
            rect = this.paintedRects[i]
            this.drawRect(rect)
        }
    }

    redrawRanges () {
        if (!this.paintedRanges) {
            return
        }
        this.clear()
        this.paintedRects = []
        for (let i = 0, l = this.paintedRanges.length, range, rects; i < l; i++) {
            range = this.paintedRanges[i]
            rects = this._getRangeRects(range.x, range.y, range.n)
            for (let j = 0, m = rects.length, rect; j < m; j++) {
                rect = rects[j]
                this.paintedRects.push(rect)
                this.drawRect(rect)
            }
        }
    }
}

export default Editor
