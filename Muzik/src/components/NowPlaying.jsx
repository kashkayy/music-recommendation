export default function NowPlaying({ currSong, onPlaying, isPlaying }) {
  if (!currSong) return null;
  return (
    <>
      <div className="now-playing-indicator" onClick={onPlaying}>
        <div className="now-playing-text">
          {isPlaying ? "Now playing: " : "Paused: "}
        </div>
        <img
          className="song-img"
          src={currSong.coverUrl}
          alt={`${currSong.title} cover`}
        />
        <div className="now-playing-text">
          <h3>
            {currSong.title} by {currSong.artist}
          </h3>
        </div>
      </div>
    </>
  );
}
