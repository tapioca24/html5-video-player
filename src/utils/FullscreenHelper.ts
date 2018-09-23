const FullscreenHelper = {
  enabled: !!(
    document.fullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled ||
    (document as any).webkitSupportsFullscreen ||
    document.webkitFullscreenEnabled ||
    document.createElement('video').webkitRequestFullScreen
  ),

  isFullScreen() {
    return !!(
      (document as any).fullScreen ||
      document.webkitIsFullScreen ||
      (document as any).mozFullScreen ||
      (document as any).msFullscreenElement ||
      document.fullscreenElement
    );
  },

  handleFullscreen(videoContainer: HTMLElement) {
    if (this.isFullScreen()) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } else {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if ((videoContainer as any).mozRequestFullScreen) {
        (videoContainer as any).mozRequestFullScreen();
      } else if (videoContainer.webkitRequestFullScreen) {
        videoContainer.webkitRequestFullScreen();
      } else if ((videoContainer as any).msRequestFullscreen) {
        (videoContainer as any).msRequestFullscreen();
      }
    }
  },
};

export default FullscreenHelper;
