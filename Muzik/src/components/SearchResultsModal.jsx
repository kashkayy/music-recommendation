import { useState, useEffect } from "react";
import { getSearchResults } from "../api";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { FaPlay, FaPause } from "react-icons/fa";
import loading from "../assets/loading.svg";
import AudioPlayer from "./AudioPlayer";
import useSongPlayer from "../hooks/SongPlayer";
export default function SearchModal({
  query,
  onClose,
  userLat,
  userLng,
  onSave,
  favorites,
}) {
  const [results, setResults] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    isPlaying,
    checkSongPlaying,
    handlePlayPauseClick,
    artist,
    title,
    handleEnd,
    handleCardClick,
    currSong,
    isClicked,
  } = useSongPlayer();
  useEffect(() => {
    getSearchResults(query).then((data) => {
      setResults(data.results);
      setIsLoaded(true);
    });
  }, [query]);
  function isSongFavorited(song) {
    return favorites.some(
      (favorite) =>
        favorite.song.title === song.title &&
        favorite.song.artist === song.artist
    );
  }
  return (
    <>
      <div className="search-modal">
        <div className="search-modal-content-container">
          <button className="close-btn" onClick={onClose}>
            X
          </button>
          <h2 className="results">
            <strong>Search Results</strong>
          </h2>
          {isLoaded ? (
            <div className="modal-content">
              {results.map((song) => (
                <div
                  className="song-info"
                  key={song.id}
                  onClick={() => handleCardClick(song)}
                >
                  <div className="card-img-wrapper">
                    <img
                      src={song.coverUrl}
                      alt="song preview Image"
                      className="song-img"
                      onClick={() => handleCardClick(song)}
                    />
                    <div
                      className="play-pause-button"
                      onClick={(event) => handlePlayPauseClick(song, event)}
                    >
                      {isPlaying && checkSongPlaying(song) ? (
                        <FaPause />
                      ) : (
                        <FaPlay />
                      )}
                    </div>
                    {isClicked && checkSongPlaying(song) && (
                      <AudioPlayer
                        song={currSong}
                        selectedArtist={artist}
                        selectedTitle={title}
                        isPlaying={isPlaying}
                        onEnd={handleEnd}
                      />
                    )}
                  </div>
                  <div className="song-details">
                    <p className="song-name">{song.title}</p>
                    <p className="artist-name">{song.artist}</p>
                  </div>
                  <div className="favorite-action" title="add to favorites">
                    {isSongFavorited(song) ? (
                      <FaCheck />
                    ) : (
                      <IoAddCircleOutline
                        onClick={(event) =>
                          onSave(song, userLat, userLng, event)
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="loading-container">
              <img src={loading} className="loading"></img>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
