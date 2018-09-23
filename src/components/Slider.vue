<template lang="pug">
  .slider
    .container(
      ref="container"
      @mousedown.prevent.stop="moveStart"
      @mousemove.prevent="moving"
    )
      .list
        .progress(:style="{ width: 100 * progress + '%' }")
      .scrubber(:style="{ left: 100 * progress + '%' }")
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Emit, Watch } from 'vue-property-decorator';
import MathHelper from '@/utils/MathHelper';

@Component
export default class Slider extends Vue {
  @Model('change', { type: [String, Number], default: 0 }) private value!: string | number;

  @Prop({ type: [String, Number], default: 0 }) private min!: string | number;
  @Prop({ type: [String, Number], default: 0 }) private max!: string | number;

  @Emit('change') private changeValue(value: number) {}
  @Emit() private dragging() {}
  @Emit() private dragged() {}

  // progress は 0 ~ 1 の範囲の値を取る
  private progress = this.calcProgress(this.value, this.min, this.max);
  private isDragging = false;
  // container width & offset
  private width = 0;
  private offset = 0;

  @Watch('value')
  private onValueChange(newValue: string | number) {
    this.progress = this.calcProgress(newValue, this.min, this.max);
  }
  @Watch('min')
  private onMinChange(newMin: string | number) {
    this.progress = this.calcProgress(this.value, newMin, this.max);
  }
  @Watch('max')
  private onMaxChange(newMax: string | number) {
    this.progress = this.calcProgress(this.value, this.min, newMax);
  }
  @Watch('isDragging')
  private onIsDraggingChange(value: boolean) {
    value ? this.dragging() : this.dragged();
  }

  // Lifecycle hook
  private mounted() {
    this.bindEvents();
  }
  private beforeDestroy() {
    this.unbindEvents();
  }

  // Setup & Teardown Event Handlers
  private bindEvents() {
    document.addEventListener('mousemove', this.moving);
    document.addEventListener('mouseup', this.moveEnd);
    document.addEventListener('mouseleave', this.moveEnd as any);
  }
  private unbindEvents() {
    document.removeEventListener('mousemove', this.moving);
    document.removeEventListener('mouseup', this.moveEnd);
    document.removeEventListener('mouseleave', this.moveEnd as any);
  }

  // Event Handlers
  private moveStart(e: MouseEvent) {
    const pos = this.getPos(e);
    this.progress = pos;
    this.setPos(pos);
    this.isDragging = true;
  }
  private moving(e: MouseEvent) {
    if (!this.isDragging) { return; }
    const pos = this.getPos(e);
    this.progress = pos;
    this.setPos(pos);
  }
  private moveEnd(e: MouseEvent) {
    if (!this.isDragging) { return; }
    const pos = this.getPos(e);
    this.setPos(pos);
    this.isDragging = false;
  }

  private calcProgress(value: number | string, min: number | string, max: number | string): number {
    return MathHelper.map(value as number, min as number, max as number, 0, 1, true);
  }
  // Update Element Status
  private updateStatus() {
    const container = this.$refs.container as HTMLDivElement;
    this.width = container.offsetWidth;
    this.offset = container.getBoundingClientRect().left;
  }
  // Get position [0 ~ 1]
  private getPos(e: MouseEvent) {
    this.updateStatus();
    return MathHelper.clamp((e.clientX - this.offset) / this.width, 0, 1);
  }
  // Set position [0 ~ 1]
  private setPos(pos: number) {
    const value = MathHelper.lerp(this.min as number, this.max as number, pos);
    this.changeValue(value);
  }
}
</script>

<style lang="scss" scoped>
$slider-color: white;
.slider {
  width: 100%;
}
.container {
  position: relative;
  width: 100%;
  height: 20px;
  cursor: pointer;
}
.list {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  height: 3px;
  transition: height .1s;
  background: rgba(white, .4);
}
.progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: $slider-color;
}
.scrubber {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateX(-50%) translateY(-50%);
  width: 13px;
  height: 13px;
  border-radius: 50%;
  transition: width .2s, height .2s;
  background: $slider-color;
}
</style>
