<template>
<div class="output editor" tabindex="6" v-text="output"></div>
</template>

<script>
export default {
    props: ['output']
}
</script>

<style>
.output {
    white-space: pre-wrap;
}
</style>
