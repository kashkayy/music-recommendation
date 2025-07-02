import { useState, useEffect } from "react"
import { getTrendingSongs } from "../api"
export default function MarkerModal({lat, lng, onClose}){
  const [songs, setSongs] = useState([])
  useEffect(() => {
    getTrendingSongs(lat, lng).then((data) => setSongs(data.results));
  }, [lat, lng]);
  return(
    <>
      <div className="modal">
        <div className="modal-content-container">
            <button className="close-btn" onClick={onClose}>X</button>
            <h2><strong>What's trending here?</strong></h2>
            <div className="modal-content">
              {songs.map(({song}, index) => (
                  <div className="song-info" key={index}>
                    <img src={song.coverUrl} alt="song preview Image" className="song-img"/>
                    <div className="song-details">
                      <p className="song-name">{song.title}</p>
                      <p className="artist-name">{song.artist}</p>
                    </div>
                  </div>
            ))}
            </div>
          </div>
        </div>
    </>
  )
}
