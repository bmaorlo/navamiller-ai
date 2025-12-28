export default function VideoPlayer({ videoId, provider = 'vimeo', autoplay = false }) {
  if (!videoId) {
    return (
      <div className="video-container">
        <div className="video-placeholder">
          <div className="video-placeholder-icon">🎬</div>
          <span>הסרטון יופיע כאן</span>
        </div>
      </div>
    );
  }

  const getEmbedUrl = () => {
    const autoplayParam = autoplay ? '&autoplay=1' : '';
    
    switch (provider.toLowerCase()) {
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0${autoplayParam}`;
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoplayParam}`;
      default:
        return null;
    }
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="video-container">
        <div className="video-placeholder">
          <div className="video-placeholder-icon">⚠️</div>
          <span>ספק וידאו לא נתמך</span>
        </div>
      </div>
    );
  }

  return (
    <div className="video-container">
      <iframe
        src={embedUrl}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Video"
      />
    </div>
  );
}

