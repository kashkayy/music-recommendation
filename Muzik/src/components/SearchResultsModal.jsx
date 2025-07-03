import { useState, useEffect } from "react"
import { getSearchResults } from "../api"
import { IoAddCircleOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
export default function SearchModal({query, onClose, userLat, userLng, onSave}){
  const [results, setResults] = useState([])
  useEffect(() => {
    getSearchResults(query).then((data) => setResults(data.results))}, [query])
  return(
    <>
      <div className="search-modal">
        <div className="search-modal-content-container">
            <button className="close-btn" onClick={onClose}>X</button>
            <h2 className="results"><strong>Search Results</strong></h2>
            <div className="modal-content">
              {results.map((song, index) => (
                  <div className="song-info" key={index}>
                    <img src={song.coverUrl} alt="song preview Image" className="song-img"/>
                    <div className="song-details">
                      <p className="song-name">{song.title}</p>
                      <p className="artist-name">{song.artist}</p>
                    </div>
                    {song.savedBy?.length > 0? <FaCheck/>: <div className="favorite-action" title="add to favorites"><IoAddCircleOutline onClick={()=> onSave(song, userLat, userLng)}/></div>}
                  </div>
            ))}
            </div>
          </div>
        </div>
    </>
  )}
