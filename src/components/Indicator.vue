<template lang="pug">
  .indicator
    .container(ref="container")
      i.material-icons.md-light.md-48 {{ indicatorIcon }}
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Indicator extends Vue {
  @Prop({ type: Boolean, required: true }) private played!: boolean;

  get indicatorIcon() {
    return this.played ? 'play_arrow' : 'pause';
  }

  @Watch('played')
  private onPlayedChange(value: boolean) {
    const container = this.$refs.container as HTMLDivElement;
    container.animate([
      { opacity: 1, transform: 'scale(0.5)' },
      { opacity: 0, transform: 'scale(1)' },
    ] as any, {
      duration: 800,
      easing: 'ease-out',
    }).play();
  }
}
</script>

<style lang="scss" scoped>
.container {
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  $indicator-size: 100px;
  width: $indicator-size;
  height: $indicator-size;
  border-radius: 50%;
  background: #333;
}
</style>
