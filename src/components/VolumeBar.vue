<template lang="pug">
  .volume-bar
    .container(:class="{ dragging: volumeDragging }")
      ControlsButton(@click="toggleMuted")
        i.material-icons.md-light {{ muteIcon }}
      Slider.volume(
        :value="volume"
        @change="setVolume"
        @dragging="onDragging"
        @dragged="onDragged"
        max="1"
      )
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import ControlsButton from '@/components/ControlsButton.vue';
import Slider from '@/components/Slider.vue';
import MathHelper from '@/utils/MathHelper';

@Component({
  components: {
    ControlsButton,
    Slider,
  },
})
export default class VolumeBar extends Vue {
  @Prop({ type: Boolean, required: true }) private muted!: boolean;
  @Prop({ type: [String, Number], required: true }) private volume!: string | number;

  @Emit('mutedchange') private setMuted(muted: boolean) {}
  @Emit('volumechange') private setVolume(volume: number) {}

  private oldVolume = this.volume as number;
  private volumeDragging = false;

  get muteIcon() {
    if (this.muted) {
      return 'volume_off';
    } else if (this.volume < 0.5) {
      return 'volume_down';
    } else {
      return 'volume_up';
    }
  }

  @Watch('volume')
  private onVolumeChange(newValue: string | number, oldValue: string | number) {
    newValue = Number(newValue);
    oldValue = Number(oldValue);
    if (newValue > 0 && oldValue === 0) {
      this.setMuted(false);
    } else if (newValue === 0 && oldValue > 0) {
      this.setMuted(true);
    }
  }

  private onDragging() {
    this.volumeDragging = true;
  }
  private onDragged() {
    if (this.volume > 0) {
      this.oldVolume = this.volume as number;
    }
    this.volumeDragging = false;
  }
  private toggleMuted() {
    if (this.muted) {
      this.setMuted(false);
      this.setVolume(this.oldVolume);
    } else {
      this.setMuted(true);
      this.setVolume(0);
    }
  }
  private increaseVolume(amount: number) {
    const volume = MathHelper.clamp(this.volume as number + amount, 0, 1);
    this.setVolume(volume);
    this.onDragged();
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  transition: padding-right .3s;
  &:hover,
  &.dragging {
    padding-right: 10px;
    .volume {
      opacity: 1;
      width: 70px;
    }
  }
}
.volume {
  opacity: 0;
  margin-left: 4px;
  width: 0;
  transition: all .3s;
}
</style>

