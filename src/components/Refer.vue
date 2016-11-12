<template>
<div class="refer">
  <div class="refer-exps">
    <h4 class="refer-exps_header">常用表达式：</h4>
    <div>
      <button
        class="refer-exps_item"
        v-for="v in regexps"
        v-text="v.title"
        @click="setRegexp(v)"
      />
    </div>
  </div>
</div>
</template>

<script>
import {BOX_NONE, BOX_NAV} from '../types'
import regexps from '../regexps'
import bus from '../bus.js'

export default {
  data () {
    return {regexps}
  },
  methods: {
    setRegexp (value) {
      bus.$emit('setRegexp', value)
      if (!this.$root.isBox(BOX_NONE) && !this.$root.isBox(BOX_NAV)) {
        this.$root.toggleBox(BOX_NONE)
      }
    },
  },
}
</script>

<style>
@import "../css/variables.css";

.refer {
  position: absolute;
  top: var(--height-header);
  display: none;
  width: 100%;
  z-index: 9;
  background-color: var(--color-panel-background);
  color: var(--color-panel-text);
  opacity: .9;
}
.showNav .refer {
  display: block;
}
.refer::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 1px;
  background-color: var(--color-head-background);
  box-shadow: 0 2px 2px var(--color-head-background);
}

.refer-exps {
  padding: 16px;
}
.refer-exps_header {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}
.refer-exps_item {
  position: relative;
  width: 100%;
  margin-bottom: 8px;
  padding: 8px 0;
  box-sizing: border-box;
  appearance: none;
  border: none;
  outline: none;
  background-color: rgba(0, 0, 0, 0);
  color: inherit;
}
.refer-exps_item:hover {
  background-color: rgba(0, 0, 0, .1);
}

@media(--pc) {
  .refer {
    position: fixed;
    bottom: 0;
    left: 0;
    display: block;
    width: var(--width-aside);
    overflow-x: hidden;
    overflow-y: auto;
    opacity: 1;
  }
}
</style>