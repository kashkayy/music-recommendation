import { getUserPlaylist } from "../api";
import { useState, useEffect } from "react";
import { Spinner } from "react-spinner-toolkit";
import { Notify } from "../utils/toast.jsx";
export default function PlaylistModal({ userId, username, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function retrievePlaylist() {
      try {
        const result = await getUserPlaylist(userId);
        setResults(result);
      } catch (error) {
        Notify();
        setError("Error loading playlist");
      } finally {
        setIsLoading(false);
      }
    }
    retrievePlaylist();
  }, []);

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
    if (!results || results.length === 0) {
      return <div>This user has no saved songs</div>;
    }

    return (
      <div className="playlist-grid">
        {results.map((item, index) => {
          const song = item.song;
          return (
            <div className="song-info" key={index}>
              <img
                src={song.coverUrl}
                alt="Song Cover"
                className="song-img"
              />
              <div className="song-details">
                <p className="song-name">{song.title}</p>
                <p className="artist-name">{song.artist}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="playlist-modal-overlay">
      <div className="playlist-modal-container">
        <div className="playlist-header">
          <h3>{username}'s Playlist</h3>
          <button className="playlist-close-btn" onClick={onClose}>✕</button>
        </div>

        {!isLoading ? (
          <div className="playlist-modal-content">{renderContent()}</div>
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
  );
}
