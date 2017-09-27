<template>
<div class="input-box">
    <div class="input">
        <input tabindex="1"
            :value="source"
            @input="update"
            autofocus>
    </div>
    <div class="select" :class="{'show':showingFlagsBox}">
        <button class="select_button"
            tabindex="2"
            v-text="flags"
            @click.stop="toggleFlagsBox"
        ></button>
        <div class="select_options">
            <button class="select_item"
                v-for="v in allFlags"
                :key="v.value"
                @click.stop="checkFlag(v.value)">
                <i class="icon icon--checkbox"
                    :class="{'checked':isFlagChecked(v.value)}"
                ></i>
                <em v-text="v.value"></em>
                {{v.title}}
            </button>
        </div>
    </div>
</div>
</template>

<script>
import {BOX_FLAGS} from '../types'
import {THROTTLE_TIME, flags as allFlags} from '../config'
import throttle from 'lodash-es/throttle'


const allFlagsArray = allFlags.map(v => v.value)

export default {
    props: ['source', 'flags'],
    computed: {
        showingFlagsBox () {
            return this.$root.isBox(BOX_FLAGS)
        },
        allFlags () {
            return allFlags
        }
    },
    methods: {
        toggleFlagsBox () {
            this.$root.toggleBox(BOX_FLAGS)
        },
        update: throttle(function (event) {
            const value = event.target.value
            this.$emit('update', {name: 'source', value})
        }, THROTTLE_TIME),
        isFlagChecked (flag) {
            const flags = this.flags
            return flags.includes(flag)
        },
        checkFlag (flag) {
            const flags = this.flags
            const value = allFlagsArray.filter(value => {
                if (flags.includes(value)) {
                    return flag !== value
                } else {
                    return flag === value
                }
            }).join('')
            this.$emit('update', {name: 'flags', value})
        }
    }
}
</script>
