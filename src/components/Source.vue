<template>
<div class="input-box">
  <div class="input">
    <input tabindex="1" :value="source" @input="update" autofocus>
  </div>
  <div class="select" :class="{'show':showingFlagsBox}">
    <button class="select_text" tabindex="2" v-text="flags" @click="toggleFlagsBox"/>
    <ul class="select_options">
      <li v-for="v in allFlags" :key="v.value">
        <button class="select_option" @click="checkFlag(v.value)">
          <i class="icon_square" :class="{'checked':isFlagChecked(v.value)}"></i>
          <em v-text="v.value"></em>
          {{v.title}}
        </button>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import {BOX_FLAGS} from '../types'
import {MIN_DELAY, MAX_DELAY, flags as allFlags} from '../config'
import {throttle} from '../util'

const allFlagsArray = allFlags.map(v => v.value)

export default {
  props: ['source', 'flags'],
  computed: {
    showingFlagsBox () {
      return this.$root.isBox(BOX_FLAGS)
    },
    allFlags () {
      return allFlags
    },
  },
  methods: {
    toggleFlagsBox () {
      this.$root.toggleBox(BOX_FLAGS)
    },
    update: throttle(function (event) {
      const value = event.target.value
      this.$emit('update', {name: 'source', value})
    }, MIN_DELAY, MAX_DELAY),
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
    },
  },
}
</script>
