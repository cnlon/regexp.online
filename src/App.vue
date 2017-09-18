<template>
<div id="app" :class="{'showNav':showingNavBox}">
    <top/>
    <refer/>
    <bench/>
</div>
</template>

<script>
import {BOX_NONE, BOX_NAV} from './types'
import Top from './components/Top.vue'
import Refer from './components/Refer.vue'
import Bench from './components/Bench.vue'


export default {
    data () {
        return {
            showingBox: BOX_NONE,
        }
    },
    computed: {
        showingNavBox () {
            return this.isBox(BOX_NAV)
        },
    },
    methods: {
        isBox (box) {
            return this.showingBox === box
        },
        toggleBox (box) {
            this.showingBox = this.showingBox === box ? BOX_NONE : box
        },
    },
    components: {
        Top,
        Refer,
        Bench,
    },
}
</script>

<style>
#app {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
