import React, { FC } from 'react';
import videojs from 'video.js';
import styles from './VideoJS.module.scss';

require('video.js/dist/video-js.css');

export type VideoJSProps = {
  options: any;
  onReady: (player: videojs.Player, vjsInstance: videojs) => void;
};

export const VideoJS: FC<VideoJSProps> = ({ options, onReady }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      // eslint-disable-next-line no-multi-assign
      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.debug('player is ready');
        return onReady && onReady(player, videojs);
      }));

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }

    // Add a cachebuster param to playlist URLs.
    videojs.Vhs.xhr.beforeRequest = o => {
      console.log('beforeRequest');
      if (o.uri.match('m3u8')) {
        const cachebuster = Math.random().toString(16).substr(2, 8);
        // eslint-disable-next-line no-param-reassign
        o.uri = `${o.uri}?cachebust=${cachebuster}`;
      }

      return o;
    };
  }, [options, videoRef]);

  return (
    <div data-vjs-player>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        className={`video-js vjs-big-play-centered vjs-show-big-play-button-on-pause ${styles.player} vjs-owncast`}
      />
    </div>
  );
};

export default VideoJS;
