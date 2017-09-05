<template>
<main class="bench">
    <div class="bench-wrap bench-wrap--input">
        <source-box :class="{'error':sourceIsError}" :source="source" :flags="flags" @update="update"/>
        <input-editer class="bench-wrap_editer" ref="input" :input="input" @update="update" @resize="resize"/>
    </div>
    <div class="bench-wrap bench-wrap--output" v-show="showSolution">
        <resolve-box class="bench-wrap_bar" :resolve="resolve" :mode="mode" @update="update"/>
        <output-editer class="bench-wrap_editer" :output="output"/>
    </div>
    <button class="bench_toggle" tabindex="7" @click="toggle" v-text="toggleText"/>
</main>
</template>

<script>
import {defaultRegexp, defaultResolve, demoRegexp} from '../config'
import SourceBox from './Source.vue'
import InputEditer from './Input.vue'
import ResolveBox from './Resolve.vue'
import OutputEditer from './Output.vue'
import {
    BOX_NONE,
    MODE_NONE,
    MODE_LIST,
    MODE_REPLACE,
    PARSE,
    RESIZE,
    ERROR,
    READY,
} from '../types'
import makeWorker from '../makeWorker'
import bus from '../bus'

export default {
    props: ['uid'],
    data () {
        return {
            showSolution: false,
            output: '',
            ...defaultRegexp,
            sourceIsError: false,
        }
    },
    computed: {
        toggleText () {
            return this.showSolution ? '－' : '＋'
        },
    },
    mounted () {
        this.worker = makeWorker((method, data) => {
            switch (method) {
                case PARSE:
                    this.sourceIsError = false
                    this.output = data.output
                    this.$refs.input.paint(data.matches)
                    break
                case ERROR:
                    this.sourceIsError = true
                    break
                case READY:
                    if (this.uid === 0) {
                        this.setRegexp(demoRegexp)
                    }
                    break
            }
        })
        bus.$on('setRegexp', this.setRegexp)
    },
    beforeDestroy () {
        this.worker.terminate()
        this.worker = null
        bus.$off('setRegexp', this.setRegexp)
    },
    methods: {
        setRegexp ({
            source = defaultRegexp.source,
            flags = defaultRegexp.flags,
            input = defaultRegexp.input,
            resolve = defaultRegexp.resolve,
            mode = defaultRegexp.mode,
        }) {
            this.source = source
            this.flags = flags
            if (!this.input) {
                this.input = input
            }
            if (mode && mode !== MODE_NONE) {
                this.resolve = resolve
                this.mode = mode
                this.showSolution = true
            } else if (!this.resolve && !this.input) {
                this.showSolution = false
            }
            this.post()
        },
        update ({name, value}) {
            this[name] = value
            if (name === 'mode') {
                if (value === MODE_LIST && this.resolve === defaultResolve[MODE_REPLACE]) {
                    this.resolve = defaultResolve[MODE_LIST]
                } else if (value === MODE_REPLACE && this.resolve === defaultResolve[MODE_LIST]) {
                    this.resolve = defaultResolve[MODE_REPLACE]
                }
            }
            this.post()
        },
        post () {
            if (!this.source) {
                const inputChild = this.$refs.input
                inputChild.paint(null)
                return
            }
            const data = {
                source: this.source,
                flags: this.flags,
                input: this.input,
            }
            if (this.showSolution) {
                data.resolve = this.resolve
                data.mode = this.mode
            } else {
                data.mode = MODE_NONE
            }
            this.worker.post(PARSE, data)
        },
        resize (options) {
            this.worker.post(RESIZE, options)
            this.post()
        },
        toggle () {
            if (this.showSolution) {
                this.showSolution = false
            } else {
                this.showSolution = true
                if (!this.mode || this.mode === MODE_NONE) {
                    this.mode = MODE_LIST
                    if (!this.resolve || this.resolve === defaultResolve[MODE_REPLACE]) {
                        this.resolve = defaultResolve[MODE_LIST]
                    }
                } else if (!this.resolve || this.resolve === defaultResolve[MODE_LIST]) {
                    this.resolve = defaultResolve[MODE_REPLACE]
                }
                this.post()
            }
            this.$root.toggleBox(BOX_NONE)
        },
    },
    components: {
        SourceBox,
        InputEditer,
        ResolveBox,
        OutputEditer,
    },
}
</script>

<style>
@import "../css/variables.css";

.bench {
    padding: 8px;
    color: var(--color-text);
}
.bench-wrap {
    background-color: white;
}
.bench-wrap--output {
    margin-top: 12px;
}

.bench-wrap--input .bench-wrap_editer {
    height: 50vh;
    min-height: 240px;
}
.bench-wrap--output .bench-wrap_editer {
    min-height: 100px;
}
.bench_toggle {
    float: right;
    width: 32px;
    height: 32px;
    padding: 0;
    appearance: none;
    border: none;
    outline: none;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    font-size: 20px;
    background-color: transparent;
    color: inherit;
}
.bench_toggle:hover {
    background-color: var(--color-panel-background);
    color: var(--color-panel-text);
}

@media(--pc) {
    .bench {
        position: fixed;
        top: var(--height-header);
        right: 0;
        bottom: 0;
        left: var(--width-aside);
        display: flex;
        flex-flow: column nowrap;
        padding: 16px;
    }
    .bench-wrap {
        flex: 1 1 auto;
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
    }
    .bench-wrap_editer {
        flex: 1 1 auto;
        height: 100%;
    }
    .bench_toggle {
        position: fixed;
        right: 16px;
        bottom: 16px;
    }
}
</style>
