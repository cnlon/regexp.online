<template>
<main class="bench">
    <div class="bench-box bench-box--input">
        <source-box class="bench-box_input"
            :class="{'error':sourceIsError}"
            :source="source"
            :flags="flags"
            @update="update"
        ></source-box>
        <input-editor class="bench-box_editor"
            ref="input"
            :input="input"
            @update="update"
        ></input-editor>
    </div>
    <div class="bench-box bench-box--output"
        v-show="showSolution">
        <resolve-box class="bench-box_input"
            :resolve="resolve"
            :mode="mode"
            @update="update"
        ></resolve-box>
        <output-editor class="bench-box_editor"
            :output="output"
        ></output-editor>
    </div>
    <button class="bench_toggle"
        tabindex="7"
        v-text="toggleText"
        @click="toggle"
    ></button>
</main>
</template>

<script>
import {defaultRegexp, defaultResolve, demoRegexp} from '../config'
import SourceBox from '../components/Source.vue'
import InputEditor from '../components/Input.vue'
import ResolveBox from '../components/Resolve.vue'
import OutputEditor from '../components/Output.vue'
import {
    BOX_NONE,
    MODE_NONE,
    MODE_LIST,
    MODE_REPLACE,
    PARSE,
    ERROR,
    READY,
} from '../types'
import makeWorker from '../worker/'
import bus from '../bus'


export default {
    data () {
        return {
            showSolution: false,
            output: '',
            ...defaultRegexp,
            sourceIsError: false
        }
    },
    computed: {
        toggleText () {
            return this.showSolution ? '－' : '＋'
        }
    },
    mounted () {
        this.worker = makeWorker((method, data) => {
            switch (method) {
                case PARSE:
                    this.sourceIsError = false
                    this.$refs.input.paint(data.matches)
                    this.output = data.output
                    break
                case ERROR:
                    this.sourceIsError = true
                    this.$refs.input.paint()
                    break
                case READY:
                    const lastState = {
                        source: localStorage.getItem('source'),
                        flags: localStorage.getItem('flags'),
                        input: localStorage.getItem('input'),
                        resolve: localStorage.getItem('resolve'),
                        mode: localStorage.getItem('mode')
                    }
                    const isLastStateValid = Object.values(lastState).some(Boolean)
                    const defaultState = isLastStateValid ? lastState : demoRegexp
                    this.setRegexp(defaultState)
                    const showSolution = localStorage.getItem('showSolution')
                    this.showSolution = showSolution === 'true'
                    break
            }
        })
        bus.$on('setRegexp', this.setRegexp)
        window.addEventListener('unload', () => {
            localStorage.setItem('source', this.source)
            localStorage.setItem('flags', this.flags)
            localStorage.setItem('input', this.input)
            localStorage.setItem('resolve', this.resolve)
            localStorage.setItem('mode', this.mode)
            localStorage.setItem('showSolution', String(this.showSolution))
        })
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
            this.$nextTick(() => {
                this.$refs.input.resize()
                this.post()
            })
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
            const {source, input} = this
            if (!source || !input || input === '\n') {
                this.$refs.input.paint()
                return
            }
            const data = {
                source: source,
                flags: this.flags,
                input: input,
            }
            if (this.showSolution) {
                data.resolve = this.resolve
                data.mode = this.mode
            } else {
                data.mode = MODE_NONE
            }
            this.worker.post(PARSE, data)
        },
        toggle () {
            this.$refs.input.clear()
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
            }
            this.$root.toggleBox(BOX_NONE)
            this.$nextTick(() => {
                this.post()
                this.$refs.input.resize()
            })
        },
    },
    components: {
        SourceBox,
        InputEditor,
        ResolveBox,
        OutputEditor,
    },
}
</script>

<style>
@import "../css/_variables.css";
@import "../css/_mixins.css";


.bench {
    position: fixed;
    top: var(--header-height);
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-flow: column nowrap;
    padding: 8px;
}

.bench-box {
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    background-color: white;
}

.bench-box--output {
    margin-top: 12px;
}

.bench-box_input {
    flex: none;
}

.bench-box_editor {
    flex: 1 1 auto;
    height: 100%;
}

.bench_toggle {
    @apply --no-appearance-button;

    position: fixed;
    right: 16px;
    bottom: 16px;
    width: 32px;
    height: 32px;
    padding: 0;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    font-size: 20px;
    background-color: transparent;
    opacity: .3;
    transition: opacity .15s;
}
.bench_toggle:hover {
    color: var(--color-panel-text);
    background-color: var(--color-panel-background);
    opacity: 1;
}

.bench [tabindex]:not(button):focus {
    box-shadow: 0 0 8px color(var(--color-text) alpha(-80%));
    transition: box-shadow .15s;
}
.bench-box>.error {
    outline: 1px solid color(var(--color-red) alpha(-50%));;
    transition: outline-color .15s;
}

@media(--pc) {
    .bench {
        left: var(--aside-width);
        padding: 16px;
    }
}
</style>
