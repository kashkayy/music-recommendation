import { getHybridRecommendation } from "../api";
import { useEffect, useState } from "react";
import { Spinner } from "react-spinner-toolkit";
import { Notify } from "../utils/toast";
import { FaPlay, FaPause } from "react-icons/fa";
import AudioPlayer from "./AudioPlayer";
export default function Hybrid({
  onSave,
  userLat,
  userLng,
  range,
  userId,
  registerRef,
  artist,
  title,
  handleEnd,
  isPlaying,
  handleCardClick,
  checkSongPlaying,
  handlePlayPauseClick,
  isClicked,
  currSong,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    async function getResults() {
      setIsLoading(true);
      try {
        const results = await getHybridRecommendation(
          userLat,
          userLng,
          range,
          userId
        );
        setRecommendations(results);
      } catch (error) {
        Notify();
      } finally {
        setIsLoading(false);
      }
    }
    getResults();
  }, [userId, userLat, userLng, range]);
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
          </div>
          <div className="action">
            <button
              className="add-button"
              onClick={(event) =>
                onSave(recommendation.song, userLat, userLng, event)
              }
            >
              Add to favorites
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
