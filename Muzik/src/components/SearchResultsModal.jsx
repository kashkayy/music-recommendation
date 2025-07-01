import { useState, useEffect } from "react"
import { getSearchResults } from "../api"
export default function SearchModal({query, onClose}){
  const [results, setResults] = useState([])
  useEffect(() => {
    getSearchResults(query).then((data) => setResults(data.results))}, [query])
  return(
    <>
      <div className="modal">
        <div className="modal-content-container">
            <button className="close-btn" onClick={onClose}>X</button>
            <h2><strong>Search Results</strong></h2>
            <div className="modal-content">
              {results.map((song, index) => (
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
  )}
