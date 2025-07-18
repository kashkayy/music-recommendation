import SearchModal from "../components/SearchResultsModal";
import { useEffect, useState } from "react";
import { getUserFavorites, deleteSavedSong, saveSong } from "../api";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { Spinner } from "react-spinner-toolkit";
import AudioPlayer from "../components/AudioPlayer";
import { FaPlay, FaPause } from "react-icons/fa";
import useSongPlayer from "../hooks/SongPlayer";
export default function SongsContainer({
  userLat,
  userLng,
  favorites,
  setFavorites,
}) {
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
    getUserFavorites().then((data) => {
      setFavorites(data.results);
      setIsLoaded(true);
    });
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  function handleClick(event) {
    event.preventDefault();
    setShowModal(true);
  }
  async function handleRemove(songId, lat, lng, event) {
    event.stopPropagation();
    await deleteSavedSong(songId, lat, lng).then((data) => {
      if (data.ok) {
        setFavorites(data.results);
      }
    });
  }
  async function handleAddToFavorite(song, lat, lng, event) {
    event.stopPropagation();
    await saveSong(
      song.id,
      lat,
      lng,
      song.title,
      song.artist,
      song.coverUrl
    ).then((data) => {
      if (data.ok) {
        setFavorites(data.results);
      }
    });
  }
  function handleHide() {
    setShowModal(false);
  }
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for song"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button onClick={handleClick}>Search</button>
      </div>
      {showModal && (
        <SearchModal
          favorites={favorites}
          query={query}
          onClose={handleHide}
          onSave={handleAddToFavorite}
          userLat={userLat}
          userLng={userLng}
        />
      )}
      <div className="recommended-container">
        <h3 className="songs-header">Recommended songs for you</h3>
        <div className="recommended-songs"></div>
      </div>
      <h2 className="songs-header">Your favorites list</h2>
      {isLoaded ? (
        <div className="favorite-songs">
          {favorites.map((favorite) => (
            <div
              className="song-card"
              key={favorite.song.id}
              onClick={() => handleCardClick(favorite.song)}
            >
              <div className="card-img-wrapper">
                <img className="card-image" src={favorite.song.coverUrl} />
                <div
                  className="play-pause-button"
                  onClick={(event) =>
                    handlePlayPauseClick(favorite.song, event)
                  }
                >
                  {checkSongPlaying(favorite.song) && isPlaying ? (
                    <FaPause />
                  ) : (
                    <FaPlay />
                  )}
                </div>
                {isClicked && checkSongPlaying(favorite.song) && (
                  <AudioPlayer
                    song={currSong}
                    selectedArtist={artist}
                    selectedTitle={title}
                    onEnd={handleEnd}
                    isPlaying={isPlaying}
                  />
                )}
              </div>
              <div className="card-info">
                <h3 className="card-song">{favorite.song.title}</h3>
                <p className="card-artist">{favorite.song.artist}</p>
              </div>
              <div className="action">
                <div>
                  <IoRemoveCircleOutline
                    className="delete-action"
                    onClick={(event) =>
                      handleRemove(
                        favorite.songId,
                        favorite.lat,
                        favorite.lng,
                        event
                      )
                    }
                    title="Remove from favorites"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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
    </>
  );
}
