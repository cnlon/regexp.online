<template>
<div class="input-box">
    <div class="input">
        <input tabindex="4"
            :value="resolve"
            @input="update">
    </div>
    <div class="select" :class="{'show':showingModesBox}">
        <button class="select_button"
            tabindex="5"
            v-text="modeText"
            @click.stop="toggleModesBox"
        ></button>
        <div class="select_options">
            <button class="select_item"
                v-for="v in allModes"
                :key="v.value"
                @click="setMode(v.value)">
                <i class="icon icon--radio"
                    :class="{'checked':isMode(v.value)}"
                ></i>
                {{v.title}}
            </button>
        </div>
    </div>
</div>
</template>

<script>
import {BOX_MODES} from '../types'
import {THROTTLE_TIME, modes as allModes} from '../config'
import throttle from 'lodash-es/throttle'


export default {
    props: ['resolve', 'mode'],
    computed: {
        showingModesBox () {
            return this.$root.isBox(BOX_MODES)
        },
        modeText () {
            const currentMode = this.mode
            for (let v of allModes) {
                if (currentMode === v.value) {
                    return v.title
                }
            }
            return allModes[0].title
        },
        allModes () {
            return allModes
        },
    },
    methods: {
        toggleModesBox () {
            this.$root.toggleBox(BOX_MODES)
        },
        update: throttle(function (event) {
            const value = event.target.value
            this.$emit('update', {name: 'resolve', value})
        }, THROTTLE_TIME),
        isMode (mode) {
            return this.mode === mode
        },
        setMode (value) {
            this.$emit('update', {name: 'mode', value})
        },
    },
}
</script>
