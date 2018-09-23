<template lang="pug">
  .controls-button
    button.btn(@click="click")
      slot
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';

@Component
export default class ControlsButton extends Vue {
  @Emit() private click() {}
}
</script>

<style lang="scss" scoped>
.controls-button {
  display: inline-block;
}
.btn {
  height: 30px;
  padding: 2px 6px;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
}
</style>
