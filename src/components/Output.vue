<template>
<div class="output">
  <div class="output_editer editer" tabindex="6" v-text="output"/>
</div>
</template>

<script>
export default {
  props: ['output'],
}
</script>

<style>
@import "../css/variables.css";

.output_editer {
  width: 100%;
  height: 100%;
  white-space: pre-wrap;
}
</style>
