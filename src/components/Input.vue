<template>
<div class="input-editer"
    style="position: relative; padding: 0; box-sizing: content-box;"
    ref="editer">
    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;">
      <canvas class="input-editer_canvas"
          style="position: absolute; left: 0; top: 0; margin: 0;"
          height="2000"
          ref="canvas"
        ></canvas>
    </div>
    <textarea class="input-editer_editer editer"
        style="position: relative; margin: 0; background-color: transparent; font-family: monospace; resize: none;"
        spellcheck="false"
        tabindex="3"
        ref="textarea"
        :value="input"
        @input="update"
        @scroll="syncScroll"
    ></textarea>
</div>
</template>

<script>
import {MIN_DELAY, MAX_DELAY} from '../config'
import throttle from '../throttle'
import store from '../store'

export default {
    props: ['input'],
    data () {
        return {
            backgroundColor: '#c8a0fa',
        }
    },
    mounted () {
        const {editer, canvas, textarea} = this.$refs
        this.editer = editer
        this.canvas = canvas
        this.textarea = textarea
        this.ctx = canvas.getContext('2d')

        window.addEventListener('resize', this.resizeWidth)
        this.$nextTick(this.resizeWidth)
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.resizeWidth)
    },
    methods: {
        resizeWidth () {
            const {offsetWidth} = this.editer
            this.canvas.width = offsetWidth
            this.initialize()
        },
        initialize: throttle(function () {
            this.initializeImmediately()
        }, MIN_DELAY),
        initializeImmediately () {
            const ctx = this.ctx
            ctx.restore()
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            ctx.fillStyle = this.backgroundColor
            const rect = this.measure()
            this.$emit('resize', {
                canvasWidth: this.canvas.width,
                canvasHeight: this.canvas.height,
                ...rect,
            })
            ctx.translate(rect.paddingLeft, rect.paddingTop)
            ctx.save()
        },
        update: throttle(function (event) {
            const value = event.target.value || event.target.textContent
            this.$emit('update', {name: 'input', value})
        }, MIN_DELAY, MAX_DELAY),
        syncScroll (event) {
            this.canvas.style.top = -this.textarea.scrollTop + 'px'
            if (this.textarea.scrollHeight > this.canvas.height) {
                this.canvas.height = this.textarea.scrollHeight + 2000
                this.initializeImmediately()
            }
        },
        paint (value) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            const l = value && value.length
            if (!l) return
            let xywhs, i, ii, ll
            for (i = 0; i < l; i++) {
                xywhs = value[i].xywhs
                for (ii = 0, ll = xywhs.length; ii < ll; ii++) {
                    this.ctx.fillRect(...xywhs[ii])
                }
            }
        },
        measure () {
            let rect = store.state.charRect
            if (rect && rect.charWidth) return rect
            const {
                fontSize,
                lineHeight,
                fontWeight,
                wordSpacing,
                letterSpacing,
                paddingTop,
                paddingRight,
                paddingBottom,
                paddingLeft,
            } = window.getComputedStyle(this.textarea, null)
            const line = document.createElement('span')
            Object.assign(line.style, this.textarea.style, {
                position: 'absolute',
                left: 0,
                top: 0,
                width: 'auto',
                height: 'auto',
                whiteSpace: 'nowrap',
                visibility: 'hidden',
            }, {
                fontSize,
                lineHeight,
                fontWeight,
                wordSpacing,
                letterSpacing,
            })
            this.editer.appendChild(line)
            line.innerHTML = 'x'
            rect = line.getClientRects()[0]
            this.editer.removeChild(line)

            rect = {
                charWidth: rect.width,
                charHeight: rect.height,
                paddingTop: this.pxToNum(paddingTop),
                paddingRight: this.pxToNum(paddingRight),
                paddingBottom: this.pxToNum(paddingBottom),
                paddingLeft: this.pxToNum(paddingLeft),
            }
            store.commit('setCharRect', rect)
            return rect
        },
        pxToNum (px) {
            return Number(px.substr(0, px.length - 2))
        },
    },
}
</script>

<style>
.input-editer,
.input-editer_editer {
    width: 100%;
    height: 100%;
}
.input-editer_canvas {
    width: 100%;
    height: auto;
}
</style>
