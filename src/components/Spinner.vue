<template lang="pug">
  .spinner(v-show="loading")
    .container
      .dot.dot-odd(:style="spinnerStyle")
      .dot.dot-even(:style="spinnerStyle")
      .dot.dot-odd(:style="spinnerStyle")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Spinner extends Vue {
  @Prop({ type: Boolean, default: true }) private loading!: boolean;
  @Prop({ type: String, default: '#5dc596' }) private color!: string;
  @Prop({ type: String, default: '15px' }) private size!: string;
  @Prop({ type: String, default: '2px' }) private margin!: string;
  @Prop({ type: String, default: '50%' }) private radius!: string;

  private spinnerStyle = {
    backgroundColor: this.color,
    width: this.size,
    height: this.size,
    margin: this.margin,
    borderRadius: this.radius,
  };
}
</script>

<style lang="scss" scoped>
.dot {
  display: inline-block;
  animation: stretch .7s infinite linear;
  &.dot-odd {
    animation-delay: 0s;
  }
  &.dot-even {
    animation-delay: .35s;
  }
}

@keyframes stretch {
  50% {
    transform: scale(.75);
    opacity: .2;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
