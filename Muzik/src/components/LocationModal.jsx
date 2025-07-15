import { useState, useEffect } from "react";
import { getTrendingSongs } from "../api";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
export default function MarkerModal({
  lat,
  lng,
  onClose,
  onSave,
  userLat,
  userLng,
  favorites,
}) {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    getTrendingSongs(lat, lng).then((data) => setSongs(data.results));
  }, [lat, lng]);
  function isSongFavorited(song) {
    return favorites.some(
      (favorite) =>
        favorite.song.title === song.title &&
        favorite.song.artist === song.artist
    );
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
          <div className="modal-content">
            {songs.map(({ song }, index) => (
              <div className="song-info" key={index}>
                <img
                  src={song.coverUrl}
                  alt="song preview Image"
                  className="song-img"
                />
                <div className="song-details">
                  <p className="song-name">{song.title}</p>
                  <p className="artist-name">{song.artist}</p>
                </div>
                <div className="favorite-action" title="add to favorites">
                  {isSongFavorited(song) ? (
                    <FaCheck
                      onClick={() => alert("Song already exists in favorites!")}
                    />
                  ) : (
                    <IoAddCircleOutline
                      onClick={() => onSave(song, userLat, userLng)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
