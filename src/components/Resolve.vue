<template>
<div class="resolve input-box">
  <div class="input">
    <input
      tabindex="4"
      :value="resolve"
      @input="update"
    />
  </div>
  <div class="select" :class="{'show':showingModesBox}">
    <button class="select_text"
      tabindex="5"
      v-text="modeText"
      @click="toggleModesBox"
    />
    <ul class="select_options">
      <li v-for="v in allModes">
        <button class="select_option" @click="setMode(v.value)">
          <i class="icon_circle" :class="{'checked':isMode(v.value)}"/>
          <em v-text="v.title"/>
        </button>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import {BOX_MODES} from '../types'
import {MIN_DELAY, MAX_DELAY, modes as allModes} from '../config'
import {throttle} from '../util'

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
    }, MIN_DELAY, MAX_DELAY),
    isMode (mode) {
      return this.mode === mode
    },
    setMode (value) {
      this.$emit('update', {name: 'mode', value})
    },
  },
}
</script>

<style>
@import "../css/variables.css";

@media(--pc) {
  .resolve.input-box .select_options {
    min-width: 100px;
  }
}
</style>
