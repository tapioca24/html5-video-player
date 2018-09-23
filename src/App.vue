<template lang="pug">
  #app
    h1.title HTML5 Video Player
    VideoPlayer(
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VideoPlayer from '@/components/VideoPlayer.vue';

@Component({
  components: {
    VideoPlayer,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
body {
  background: #cfc7f8;
  background-image: linear-gradient(to top, #ebbba7 0%, #cfc7f8 100%);
  background-attachment: fixed;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #eee;
}
.title {
  letter-spacing: .02em;
}
.video-player {
  margin: 0 auto;
  max-width: 640px;
  box-shadow: 0 2.5em 2.5em -1.875em rgba(0, 0, 0, .5), 0 1.25em 5em 1em rgba(0, 0, 0, .2);
}

.material-icons {
  /* Rules for sizing the icon. */
  &.md-18 { font-size: 18px; }
  &.md-24 { font-size: 24px; }
  &.md-36 { font-size: 36px; }
  &.md-48 { font-size: 48px; }

  /* Rules for using icons as black on a light background. */
  &.md-dark { color: rgba(0, 0, 0, 0.54); }
  &.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

  /* Rules for using icons as white on a dark background. */
  &.md-light { color: rgba(255, 255, 255, 1); }
  &.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }
}
</style>
