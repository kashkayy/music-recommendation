import { useState, useEffect } from "react";
import { getClusterSongs } from "../api";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaCheck, FaPlay, FaPause } from "react-icons/fa";
import { Spinner } from "react-spinner-toolkit";
import { Notify } from "../utils/toast";
import useDebounce from "../hooks/useDebounce";
import useSongPlayer from "../hooks/SongPlayer";
import AudioPlayer from "./AudioPlayer";
export default function ClusterModal({
  lat,
  lng,
  onClose,
  onSave,
  userLat,
  userLng,
  favorites,
  zoom,
}) {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    isPlaying,
    checkSongPlaying,
    handleMouseEnter,
    artist,
    title,
    handleEnd,
    currSong,
    isClicked,
    handleMouseLeave,
    isHovering
  } = useSongPlayer();
  const debouncedMouseEnter = useDebounce(handleMouseEnter, 500);
  useEffect(() => {
    getClusterSongs(lat, lng, zoom)
      .then((data) => {
        setSongs(data.results);
        setIsLoaded(true);
      })
      .catch(() => {
        setError("Error loading songs within this cluster");
        setIsLoaded(true);
      });
  }, [lat, lng, zoom]);
  function isSongFavorited(song) {
    return favorites.some(
      (favorite) =>
        favorite.song.title === song.title &&
        favorite.song.artist === song.artist
    );
  }
  function handleAlreadyFavorited() {
    Notify("Song already exists in favorites!");
  }
  function handleSave(song) {
    onSave(song, userLat, userLng);
  }
  function renderContent() {
    if (error) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2rem",
          }}
        >
          ⚠️ {error}
        </div>
      );
    }
    if (songs.length === 0) {
      return <div>No trending songs here...</div>;
    }
    return songs.map((song, index) => (
      <div className="song-info" key={index}>
        <div className="song-img-container" style={{ position: 'relative' }}>
          <img
            src={song.coverurl}
            alt="song preview Image"
            className="song-img"
            onMouseEnter={() => debouncedMouseEnter(song)}
            onMouseLeave={handleMouseLeave}
          />
          <div
            className={`preview-indicator ${checkSongPlaying(song) ? 'active' : ''}`}
          >
            {checkSongPlaying(song) && isPlaying ? (
              <FaPause className="cluster-pause" />
            ) : (
              <FaPlay className="cluster-play" />
            )}
          </div>
        </div>
        {isClicked && checkSongPlaying(song) && (
          <AudioPlayer
            song={currSong}
            selectedArtist={artist}
            selectedTitle={title}
            isPlaying={isPlaying}
            onEnd={handleEnd}
            isHovering={isHovering}
            isPreview={true}
          />
        )}
        <div className="song-details">
          <p className="song-name">{song.title}</p>
          <p className="artist-name">{song.artist}</p>
        </div>
        <div className="favorite-action" title="add to favorites">
          {isSongFavorited(song) ? (
            <FaCheck onClick={handleAlreadyFavorited} />
          ) : (
            <IoAddCircleOutline onClick={() => handleSave(song)} />
          )}
        </div>
        <div>{`${song.save_count} saves 🔥`}</div>
      </div>
    ));
  }
  return (
    <>
      <div className="modal">
        <div className="modal-content-container">
          <button className="close-btn" onClick={onClose}>
            X
          </button>
          <h2>
            <strong>What's trending here?</strong>
          </h2>
          {isLoaded ? (
            <div className="modal-content">{renderContent()}</div>
          ) : (
            <div className="loading-container">
              <Spinner
                shape="threeDots"
                color="#888"
                loading
                speed={1}
                size={300}
                transition={true}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
