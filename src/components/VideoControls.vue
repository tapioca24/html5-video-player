<template lang="pug">
  .video-controls
    .panel(:class="{ seeking: seeking }")
      Indicator(:played="played")
      Spinner(:loading="seeking" color="white")
    .footer-container
      .footer
        .progress-container
          ProgressBar(:value="progress" :max="duration" @change="setProgress")
        .button-container
          //- Play/Pause Button
          ControlsButton(@click="togglePlayed") 
            i.material-icons.md-light {{ playIcon }}
          //- Stop Button
          ControlsButton.stop(@click="stop")
            i.material-icons.md-light stop
          //- Volume Bar
          VolumeBar(
            ref="volumeBar"
            :muted="muted"
            :volume="volume"
            @mutedchange="setMuted"
            @volumechange="setVolume")
          //- Duration Label
          span.duration(:class="{ transparent: duration === 0 }")
            | {{ progress | humanize }} / {{ duration | humanize }}
          //- Loop Button
          ControlsButton(@click="toggleLoop")
            i.material-icons.md-light(:class="{ 'md-inactive': !loop }") repeat
          //- Fullscreen Button
          ControlsButton(v-if="fullscreenEnabled" @click="toggleFullscreen")
            i.material-icons.md-light {{ fullscreen ? 'fullscreen_exit' : 'fullscreen' }}
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import MathHelper from '@/utils/MathHelper';
import Indicator from '@/components/Indicator.vue';
import Spinner from '@/components/Spinner.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import VolumeBar from '@/components/VolumeBar.vue';
import ControlsButton from '@/components/ControlsButton.vue';

@Component({
  components: {
    Indicator,
    Spinner,
    ProgressBar,
    VolumeBar,
    ControlsButton,
  },
  filters: {
    humanize(value: number) {
      const hour = Math.floor(value / 3600);
      const min = Math.floor((value % 3600) / 60);
      const sec = Math.floor(value % 60);
      let humanizedTime = (hour > 0) ? `${hour}:${('0' + min).slice(-2)}` : min;
      humanizedTime += `:${('0' + sec).slice(-2)}`;
      return humanizedTime;
    },
  },
})
export default class VideoControls extends Vue {
  @Prop({ type: Number, default: 0 }) private progress!: number;
  @Prop({ type: Number, default: 0 }) private duration!: number;
  @Prop({ type: Boolean, default: false }) private played!: boolean;
  @Prop({ type: Boolean, default: false }) private muted!: boolean;
  @Prop({ type: Number, default: 1 }) private volume!: number;
  @Prop({ type: Boolean, default: false }) private loop!: boolean;
  @Prop({ type: Number, default: 1 }) private speed!: number;
  @Prop({ type: Boolean, default: false }) private fullscreen!: boolean;
  @Prop({ type: Boolean, default: true }) private fullscreenEnabled!: boolean;
  @Prop({ type: Boolean, default: false }) private seeking!: boolean;

  @Emit('progress') private changeProgress(value: number) {}
  @Emit('played') private changePlayed(value: boolean) {}
  @Emit('stop') private changeStop() {}
  @Emit('muted') private changeMuted(value: boolean) {}
  @Emit('volume') private changeVolume(value: number) {}
  @Emit('loop') private changeLoop(value: boolean) {}
  @Emit('speed') private changeSpeed(value: number) {}
  @Emit('fullscreen') private changeFullscreen(value: boolean) {}

  get playIcon() {
    return this.played ? 'pause' : 'play_arrow';
  }
  get fullscreenIcon() {
    return this.fullscreen ? 'fullscreen_exit' : 'fullscreen';
  }

  // progress を amount 秒進める
  private advanceProgress(amount: number) {
    const progress = MathHelper.clamp(this.progress + amount, 0, this.duration);
    this.setProgress(progress);
  }
  private setProgress(value: number) {
    this.changeProgress(value);
  }
  public togglePlayed() {
    this.changePlayed(!this.played);
  }
  private stop() {
    this.changeStop();
  }
  private setMuted(muted: boolean) {
    this.changeMuted(muted);
  }
  private setVolume(volume: number) {
    this.changeVolume(volume);
  }
  private toggleLoop() {
    this.changeLoop(!this.loop);
  }
  private setSpeed(speed: number) {
    this.changeSpeed(speed);
  }
  public toggleFullscreen() {
    this.changeFullscreen(!this.fullscreen);
  }

  // Keyboard Event Handlers
  public keyEvent(e: KeyboardEvent) {
    const volumeBar = this.$refs.volumeBar as any;
    switch (e.key) {
      case ' ':
      case 'k':
        this.togglePlayed();
        break;
      case 'ArrowLeft':
        this.advanceProgress(-5);
        break;
      case 'ArrowRight':
        this.advanceProgress(5);
        break;
      case 'j':
        this.advanceProgress(-10);
        break;
      case 'l':
        this.advanceProgress(10);
        break;
      case 'ArrowUp':
        volumeBar.increaseVolume(0.1);
        break;
      case 'ArrowDown':
        volumeBar.increaseVolume(-0.1);
        break;
      case 'm':
        volumeBar.toggleMuted();
        break;
      case 'f':
        this.toggleFullscreen();
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
.video-controls {
  pointer-events: none;
}
.panel {
  width: 100%;
  height: 100%;
  position: relative;
  &.seeking {
    background: rgba(black, .5);
  }
  .indicator,
  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
.footer-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
}
.footer {
  $padding-h: 8px;
  $padding-v: 4px;
  $blur-size: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: $padding-v $padding-h;
  padding-top: $padding-v + $blur-size;
  padding-top: 16px;
  overflow: hidden;
  z-index: 0;
  &::before {
    content: '';
    position: absolute;
    top: 2 * $blur-size;
    left: -$blur-size;
    right: -$blur-size;
    bottom: -$blur-size;
    background: rgba(black, 0.5);
    filter: blur($blur-size);
    z-index: -1;
  }
}
.progress-container {
  display: flex;
  align-items: center;
  // margin-bottom: 2px;
}
.button-container {
  display: flex;
  align-items: center;
}
.duration {
  padding: 0 6px;
  margin-right: auto;
  font-size: 14px;
  letter-spacing: .02em;
}
.transparent {
  opacity: 0;
}
</style>
