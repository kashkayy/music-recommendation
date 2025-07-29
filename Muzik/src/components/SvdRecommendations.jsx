import { useEffect, useState } from "react";
import { getSvdRecommendations } from "../api";
import { Spinner } from "react-spinner-toolkit";
import { Notify } from "../utils/toast";
import { FaPlay, FaPause } from "react-icons/fa";
import useSongPlayer from "../hooks/SongPlayer";
import AudioPlayer from "./AudioPlayer";
import { useAuth } from "../auth/AuthContext";
export default function SVD({ onSave, userLat, userLng }) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
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
  const { user } = useAuth();
  useEffect(() => {
    async function getResults() {
      setIsLoading(true);
      try {
        const results = await getSvdRecommendations(user.id);
        setRecommendations(results);
      } catch (error) {
        Notify();
      } finally {
        setIsLoading(false);
      }
    }
    getResults();
  }, [user.id]);
  if (isLoading) {
    return (
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
    );
  }
  return (
    <>
      {recommendations.map((recommendation) => (
        <div
          className={`song-card ${
            checkSongPlaying(recommendation) ? "playing" : ""
          }`}
          key={recommendation.id}
          onClick={() => handleCardClick(recommendation)}
        >
          <div className="card-img-wrapper">
            <img className="card-image" src={recommendation.coverUrl} />
            <div
              className="play-pause-button"
              onClick={(event) => handlePlayPauseClick(recommendation, event)}
            >
              {checkSongPlaying(recommendation) && isPlaying ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
            </div>
            {isClicked && checkSongPlaying(recommendation) && (
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
            <h3 className="card-song">{recommendation.title}</h3>
            <p className="card-artist">{recommendation.artist}</p>
          </div>
          <div className="action">
            <button
              className="add-button"
              onClick={(event) =>
                onSave(recommendation, userLat, userLng, event)
              }
            >
              Add to favorites
            </button>
          </div>
        </div>
      ))}
      ;
    </>
  );
}
