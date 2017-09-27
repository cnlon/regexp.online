<template>
<div class="top">
    <div class="top-body" v-once>
        <h1 class="top-body_title">
            <span class="top-body_logo">{{title}}</span>
            <small class="top-body_version"><a target="_blank"
                tabindex="-1"
                :href="sourcePage"
                v-text="'v' + version"
            ></a></small>
        </h1>
    </div>
    <div class="top-menu">
        <button class="top-menu_toggle"
            tabindex="8"
            @click.stop="toggleNav"
            v-text="toggleText"
        ></button>
    </div>
</div>
</template>

<script>
import {BOX_NAV} from './types'

export default {
    data () {
        return {
            title: process.env.TITLE,
            version: process.env.VERSION,
            sourcePage: process.env.SOURCE_PAGE,
        }
    },
    computed: {
        toggleText () {
            return this.$root.isBox(BOX_NAV) ? '×' : '＝'
        }
    },
    methods: {
        toggleNav () {
            this.$root.toggleBox(BOX_NAV)
        }
    }
}
</script>

<style>
@import "./css/_variables.css";
@import "./css/_mixins.css";


.top {
    display: table;
    table-layout: fixed;
    width: 100%;
    height: var(--header-height);
    background-color: var(--color-head-background);
    color: var(--color-head-text);
}
.top-body {
    display: table-cell;
    padding: 0 0 0 1rem;
    vertical-align: middle;
}
.top-body_title {
    margin: 0;
    font-size: 1.25rem;
    white-space: nowrap;
    overflow: hidden;
}
.top-body_logo {
    font-family: "Droid Sans Mono";
}
.top-body_version {
    margin-left: .5em;
    font-size: .5em;
}
.top-body_title a {
    color: inherit;
}
.top-body_title a:hover {
    color: var(--color-blue);
}
.top-menu {
    display: table-cell;
    width: var(--header-height);
}
.top-menu_toggle {
    @apply --no-appearance-button;

    display: block;
    width: 100%;
    height: var(--header-height);
    padding: .5rem 1rem;
    box-sizing: border-box;
    background-color: inherit;
    font-size: 1.5rem;
}

@media(--pc) {
    .top {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }
    .top-menu_toggle {
        display: none;
    }
}
</style>
