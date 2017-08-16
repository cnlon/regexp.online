<template>
<div class="top">
  <div class="top-body">
    <h1 class="top-body_title">
      {{title}}
      <small>
        &nbsp;v
        <a target="_blank" tabindex="-1" :href="sourcePage" v-text="version"></a>
      </small>
    </h1>
  </div>
  <div class="top-menu">
    <button class="top-menu_toggle" tabindex="8" @click="toggleNav" v-text="toggleText"/>
  </div>
</div>
</template>

<script>
import {BOX_NAV} from '../types'

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
    },
  },
  methods: {
    toggleNav () {
      this.$root.toggleBox(BOX_NAV)
    },
  },
}
</script>

<style>
@import "../css/variables.css";

.top {
  display: table;
  table-layout: fixed;
  width: 100%;
  height: var(--height-header);
  background-color: var(--color-head-background);
  color: var(--color-head-text);
}
.top-body {
  display: table-cell;
  padding: 0 0 0 16px;
  vertical-align: middle;
}
.top-body_title {
  margin: 0;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
}
.top-body_title small {
  font-size: var(--font-size-xs);
}
.top-body_title a {
  color: inherit;
}
.top-body_title a:hover {
  color: var(--color-blue);
}
.top-menu {
  display: table-cell;
  width: var(--height-header);
}
.top-menu_toggle {
  display: block;
  width: 100%;
  height: var(--height-header);
  padding: 8px 16px;
  box-sizing: border-box;
  appearance: none;
  border: none;
  outline: none;
  background-color: inherit;
  color: inherit;
  font-size: 24px;
  cursor: pointer;
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
