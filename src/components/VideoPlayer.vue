<template lang="pug">
  .video-player
    .video-container(
      ref="videoContainer"
      :class="{ pausing: !played, seeking: seeking }"
      :data-fullscreen="fullscreen"
      tabindex="0"
      @keydown.prevent="onKeydown"
    )
      video.player(
        ref="video"
        :src="src"
        :poster="poster"
        :muted="muted"
        :loop="loop"
        playsinline
        @click="onVideoClick"
        @dblclick="onVideoDblclick"
        @seeking="onVideoSeeking"
        @seeked="onVideoSeeked"
        @loadedmetadata="onVideoLoadedmetadata"
        @timeupdate="onVideoTimeupdate"
        @play="onVideoPlay"
        @pause="onVideoPause"
        @ratechange="onVideoRatechange"
        @volumechange="onVideoVolumechange"
      ) #[slot]
      VideoControls(
        ref="controls"
        :progress="progress"
        :duration="duration"
        :played="played"
        :muted="muted"
        :volume="volume"
        :loop="loop"
        :speed="speed"
        :fullscreen="fullscreen"
        :seeking="seeking"
        @progress="onControlsProgress"
        @played="onControlsPlayed"
        @stop="onControlsStop"
        @muted="onControlsMuted"
        @volume="onControlsVolume"
        @loop="onControlsLoop"
        @speed="onControlsSpeed"
        @fullscreen="onControlsFullscreen"
      )
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FullscreenHelper from '@/utils/FullscreenHelper';
import VideoControls from '@/components/VideoControls.vue';

@Component({
  components: {
    VideoControls,
  },
})
export default class VideoPlayer extends Vue {
  @Prop({ type: String }) private src!: string;
  @Prop({ type: String }) private poster!: string;

  private progress = 0;
  private duration = 0;
  private played = false;
  private muted = false;
  private volume = 1;
  private loop = false;
  private speed = 1;
  private fullscreen = false;
  private fullscreenEnabled = FullscreenHelper.enabled;
  private seeking = false;

  // Lifecycle hook
  private mounted() {
    this.bindEvents();
  }
  private beforeDestroy() {
    this.unbindEvents();
  }

  // Setup & Teardown Event Handlers
  private bindEvents() {
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.onFullscreenChange);
    document.addEventListener('msfullscreenchange', this.onFullscreenChange);
  }
  private unbindEvents() {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.onFullscreenChange);
    document.removeEventListener('msfullscreenchange', this.onFullscreenChange);
  }

  // Document Event Handlers
  private onFullscreenChange(e: Event) {
    if (!FullscreenHelper.isFullScreen()) {
      this.fullscreen = false;
    }
  }
  private onKeydown(e: KeyboardEvent) {
    const controls = this.$refs.controls as VideoControls;
    controls.keyEvent(e);
  }

  // Video Event Handlers
  private onVideoClick(e: MouseEvent) {
    const controls = this.$refs.controls as VideoControls;
    controls.togglePlayed();
  }
  private onVideoDblclick(e: MouseEvent) {
    const controls = this.$refs.controls as VideoControls;
    controls.toggleFullscreen();
  }
  private onVideoSeeking(e: Event) {
    this.seeking = true;
  }
  private onVideoSeeked(e: Event) {
    this.seeking = false;
  }
  private onVideoLoadedmetadata(e: Event) {
    const video = this.$refs.video as HTMLVideoElement;
    this.duration = video.duration;
    this.volume = video.volume;
    this.speed = video.playbackRate;
  }
  private onVideoTimeupdate(e: Event) {
    const video = this.$refs.video as HTMLVideoElement;
    this.progress = video.currentTime;
  }
  private onVideoPlay(e: Event) {
    this.played = true;
  }
  private onVideoPause(e: Event) {
    this.played = false;
  }
  private onVideoRatechange(e: Event) {
    const video = this.$refs.video as HTMLVideoElement;
    this.speed = video.playbackRate;
  }
  private onVideoVolumechange(e: Event) {
    const video = this.$refs.video as HTMLVideoElement;
    this.volume = video.volume;
  }

  // Controls Event Handlers
  private onControlsProgress(progress: number) {
    this.setProgress(progress);
    this.progress = progress;
  }
  private onControlsPlayed(played: boolean) {
    played ? this.play() : this.pause();
  }
  private onControlsStop() {
    this.stop();
  }
  private onControlsMuted(muted: boolean) {
    this.muted = muted;
  }
  private onControlsVolume(volume: number) {
    this.setVolume(volume);
  }
  private onControlsLoop(loop: boolean) {
    this.loop = loop;
  }
  private onControlsSpeed(speed: number) {
    this.setSpeed(speed);
  }
  private onControlsFullscreen(fullscreen: boolean) {
    this.setFullscreen(fullscreen);
  }

  // Video Methods
  private setProgress(progress: number) {
    const video = this.$refs.video as HTMLVideoElement;
    video.currentTime = progress;
  }
  private play() {
    const video = this.$refs.video as HTMLVideoElement;
    video.play();
  }
  private pause() {
    const video = this.$refs.video as HTMLVideoElement;
    video.pause();
  }
  private stop() {
    const video = this.$refs.video as HTMLVideoElement;
    video.pause();
    video.currentTime = 0;
  }
  private setVolume(volume: number) {
    const video = this.$refs.video as HTMLVideoElement;
    video.volume = volume;
  }
  private setSpeed(speed: number) {
    const video = this.$refs.video as HTMLVideoElement;
    video.playbackRate = speed;
  }
  private setFullscreen(fullscreen: boolean) {
    const videoContainer = this.$refs.videoContainer as HTMLDivElement;
    FullscreenHelper.handleFullscreen(videoContainer);
    this.fullscreen = fullscreen;
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  position: relative;
  outline: none;
  &:hover,
  &.pausing,
  &.seeking {
    .video-controls {
      opacity: 1;
    }
  }
  &[data-fullscreen="true"] {
    .player {
      width: 100vw;
      height: 100vh;
    }
  }
}
.player {
  display: block;
  width: 100%;
  background: #333;
}
.video-controls {
  opacity: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: opacity .3s;
}
</style>
