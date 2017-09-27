<template>
<div class="refer">
    <div class="refer-expressions">
        <h4 class="refer-expressions_header">常用表达式：</h4>
        <div>
            <button class="refer-expressions_item"
                v-for="v in regexps"
                :key="v.source"
                v-text="v.title"
                @click="setRegexp(v)"
            ></button>
        </div>
    </div>
</div>
</template>

<script>
import {BOX_NONE} from './types'
import regexps from './regexps'
import bus from './bus.js'


export default {
    data () {
        return {regexps}
    },
    methods: {
        setRegexp (value) {
            bus.$emit('setRegexp', value)
            if (!this.$root.isBox(BOX_NONE)) {
                this.$root.toggleBox(BOX_NONE)
            }
        }
    }
}
</script>

<style>
@import "./css/_variables.css";
@import "./css/_mixins.css";


.refer {
    position: absolute;
    top: var(--header-height);
    display: none;
    width: 100%;
    z-index: 9;
    background-color: var(--color-panel-background);
    color: var(--color-panel-text);
    opacity: .9;
    user-select: none;
    cursor: default;
}
.showNav .refer {
    display: block;
}
.refer::before {
    content: "";
    position: absolute;
    top: -2px;
    right: 0;
    left: 0;
    display: block;
    height: 2px;
    box-shadow: 0 1px 4px var(--color-head-background);
}

.refer-expressions_header {
    margin: 2rem 1rem 1rem;
    font-size: 1.125rem;
    font-weight: 500;
}
.refer-expressions_item {
    @apply --no-appearance-button;

    position: relative;
    width: 100%;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding: 8px 0;
    background-color: transparent;
}
.refer-expressions_item:hover {
    background-color: color(black alpha(20%));
}

@media(--pc) {
    .refer {
        position: fixed;
        bottom: 0;
        left: 0;
        display: block;
        width: var(--aside-width);
        overflow-x: hidden;
        overflow-y: auto;
        opacity: 1;
    }
}
</style>
