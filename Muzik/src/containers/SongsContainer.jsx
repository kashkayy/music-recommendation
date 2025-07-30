import SearchModal from "../components/SearchResultsModal";
import { useEffect, useState } from "react";
import { getUserFavorites, deleteSavedSong, saveSong } from "../api";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { Spinner } from "react-spinner-toolkit";
import AudioPlayer from "../components/AudioPlayer";
import { FaPlay, FaPause } from "react-icons/fa";
import useSongPlayer from "../hooks/SongPlayer";
import useRecommendation from "../hooks/useRecommendation";
import { useAuth } from "../auth/AuthContext.jsx";
import { useRef } from "react";
import NowPlaying from "../components/NowPlaying.jsx";
import { MODES } from "../utils/recModes.js";
import SVD from "../components/SvdRecommendations.jsx";
import Hybrid from "../components/HybridRecommendations.jsx";
export default function SongsContainer({
  userLat,
  userLng,
  favorites,
  setFavorites,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState(MODES.HAV);
  function handleModeSwitch(mode, event) {
    event.preventDefault();
    setMode(mode);
  }
  const songRef = useRef({});
  function registerRef(id, element) {
    if (!element) return;
    songRef.current[id] = element;
  }
  function scrollToSong(id) {
    if (!id || !songRef.current[id]) return;
    songRef.current[id].scrollIntoView({ behavior: "smooth", block: "center" });
  }
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

  const {
    getRecommendations,
    recommendationsLoading,
    recommendations,
    recommendationsError,
    range,
    handleRangeChange,
  } = useRecommendation();
  const { user } = useAuth();
  useEffect(() => {
    getUserFavorites().then((data) => {
      setFavorites(data.results);
      setIsLoaded(true);
    });
    if (userLat && userLng && user?.id) {
      getRecommendations(userLat, userLng, range, user.id);
    }
  }, [userLat, userLng, user?.id, getRecommendations]);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  function handleClick(event) {
    event.preventDefault();
    if (query) {
      setShowModal(true);
    }
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
        if (userLat && userLng && user?.id) {
          getRecommendations(userLat, userLng, range, user.id);
        }
      }
    });
  }
  function handleHide() {
    setShowModal(false);
  }
  //used to conditionally render distance info
  const distCheck = 0.5;
  function renderRecommendations() {
    if (recommendationsError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2rem",
          }}
        >
          ⚠️ {recommendationsError}
        </div>
      );
    }
    if (recommendations.length === 0 && mode !== MODES.SVD) {
      return (
        <div className="rec-error">
          No recommendations within this area. Try increasing the range!
        </div>
      );
    }
    if (mode === MODES.HAV) {
      return recommendations.map((recommendation) => (
        <div
          className={`song-card ${
            checkSongPlaying(recommendation.song) ? "playing" : ""
          }`}
          key={recommendation.song.id}
          ref={(element) => registerRef(recommendation.song.id, element)}
          onClick={() => handleCardClick(recommendation.song)}
        >
          <div className="card-img-wrapper">
            <img className="card-image" src={recommendation.song.coverUrl} />
            <div
              className="play-pause-button"
              onClick={(event) =>
                handlePlayPauseClick(recommendation.song, event)
              }
            >
              {checkSongPlaying(recommendation.song) && isPlaying ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
            </div>
            {isClicked && checkSongPlaying(recommendation.song) && (
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
            <h3 className="card-song">{recommendation.song.title}</h3>
            <p className="card-artist">{recommendation.song.artist}</p>
            <p className="card-distance">
              {recommendation.distance.toFixed(2) > distCheck
                ? `${recommendation.distance.toFixed(2)} km away`
                : `saved nearby`}
            </p>
          </div>
          <div className="action">
            <button
              className="add-button"
              onClick={(event) =>
                handleAddToFavorite(
                  recommendation.song,
                  recommendation.lat,
                  recommendation.lng,
                  event
                )
              }
            >
              Add to favorites
            </button>
          </div>
        </div>
      ));
    } else if (mode === MODES.SVD) {
      return (
        <SVD onSave={handleAddToFavorite} userLat={userLat} userLng={userLng} />
      );
    } else if (mode === MODES.HYBRID) {
      return (
        <Hybrid
          onSave={handleAddToFavorite}
          userLat={userLat}
          userLng={userLng}
          range={range}
          userId={user.id}
        />
      );
    }
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
      {currSong && (
        <NowPlaying
          currSong={currSong}
          isPlaying={isPlaying}
          onPlaying={() => scrollToSong(currSong.id)}
        />
      )}
      <div className="recommended-container">
        <div className="rec-header-container">
          <h3 className="songs-header">Recommended songs</h3>
          <div className="rec-switch">
            <div className="rec-btns">
              {Object.keys(MODES).map((mode) => (
                <button
                  key={mode}
                  onClick={(event) => handleModeSwitch(MODES[mode], event)}
                >
                  {MODES[mode]}
                </button>
              ))}
            </div>
          </div>
          {mode !== MODES.SVD && (
            <div className="range-slider">
              <label className="search-radius">Search radius: {range} km</label>
              <input
                type="range"
                min="1"
                max="50"
                value={range}
                onChange={handleRangeChange}
              />
            </div>
          )}
        </div>
        {recommendationsLoading ? (
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
        ) : (
          <div className="recommended-songs">{renderRecommendations()}</div>
        )}
      </div>
      <div className="fav-container">
        <h2 className="songs-header">Your favorites list</h2>
        {isLoaded ? (
          <div className="favorite-songs">
            {favorites.map((favorite) => (
              <div
                className={`song-card ${
                  checkSongPlaying(favorite.song) ? "playing" : ""
                }`}
                key={favorite.song.id}
                onClick={() => handleCardClick(favorite.song)}
                ref={(element) => registerRef(favorite.song.id, element)}
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
      </div>
    </>
  );
}
