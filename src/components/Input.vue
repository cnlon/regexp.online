<template>
<div class="fluor-editor-wrapper">
    <div class="fluor-editor-container">
        <div class="editor" ref="editor"></div>
    </div>
</div>
</template>

<script>
import {THROTTLE_TIME} from '../config'
import throttle from 'lodash-es/throttle'
import Editor from '../../editor/'


export default {
    props: ['input'],
    mounted () {
        this.$nextTick(() => {
            this.editor = new Editor(this.$refs.editor, {color: '#aef'})
            this.editor.editor.tabIndex = 3
            let isInput = false
            this.$watch('input', (newValue, oldValue) => {
                if (isInput) {
                    isInput = false
                    return
                }
                this.editor.content = newValue
            })
            this._inputListener = () => {
                isInput = true
                this.update()
            }
            this.editor.editor.addEventListener('input', this._inputListener)
        })
    },
    beforeDestroy () {
        this.editor.editor.removeEventListener('input', this._inputListener)
        this._inputListener = null
        this.editor.destroy()
        this.editor = null
    },
    methods: {
        clear () {
            this.editor.clear()
        },
        resize () {
            this.editor.resize()
        },
        update: throttle(function () {
            const value = this.editor.content
            this.$emit('update', {name: 'input', value})
        }, THROTTLE_TIME),
        paint (items) {
            const offsets = []
            for (const {index, length} of items || []) {
                offsets.push(index, index + length)
            }
            this.editor.draw(...offsets)
        }
    },
}
</script>

<style>
@import "../../editor/editor.css";
@import "../../editor/linebreak.css";

.fluor-editor-wrapper {
    position: relative;
}

.fluor-editor-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
