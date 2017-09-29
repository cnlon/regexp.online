<template>
<div id="app" :class="{'showNav':showingNavBox}">
    <top/>
    <refer/>
    <bench/>
</div>
</template>

<script>
import {BOX_NONE, BOX_NAV} from '../types'
import Top from './Top.vue'
import Refer from './Refer.vue'
import Bench from './Bench.vue'


export default {
    data () {
        return {
            showingBox: BOX_NONE,
        }
    },
    computed: {
        showingNavBox () {
            return this.isBox(BOX_NAV)
        }
    },
    mounted () {
        document.documentElement.addEventListener('click', () => {
            if (this.showingBox !== BOX_NONE) {
                this.showingBox = BOX_NONE
            }
        })
    },
    methods: {
        isBox (box) {
            return this.showingBox === box
        },
        toggleBox (box) {
            this.showingBox = this.showingBox === box ? BOX_NONE : box
        }
    },
    components: {
        Top,
        Refer,
        Bench
    }
}
</script>

<style>
@import "../css/_variables.css";
@import "../css/_mixins.css";


#app {
    position: relative;
    width: 100%;
    height: 100%;
}
#app.showNav .bench {
    background-color: var(--color-pale);
    filter: blur(1px) brightness(.9);
}
</style>
