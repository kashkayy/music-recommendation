import { useState, useEffect } from "react"
import { getSearchResults } from "../api"
import { IoAddCircleOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { FaPlay, FaPause } from "react-icons/fa";
import loading from "../assets/loading.svg"
import AudioPlayer from "./AudioPlayer";
export default function SearchModal({query, onClose, userLat, userLng, onSave, favorites}){
  const [results, setResults] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [artist, setArtist] = useState(null)
  const [title, setTitle] = useState(null)
  const [isClicked, setIsClicked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currSong, setCurrSong] = useState(null)
  async function handleCardClick(song){
    setArtist(song.artist);
    setTitle(song.title);
    setCurrSong(song)
    setIsClicked(true);
    setIsPlaying(true);
  }
  function isSongPlaying(song){
    return(
        currSong &&
        currSong.title === song.title && currSong.artist === song.artist
    )
  }
  function handlePlayPauseClick(song, event){
    event.stopPropagation()
    if (song === currSong){
        setIsPlaying(!isPlaying)
    }else{
        setArtist(song.artist);
        setTitle(song.title);
        setCurrSong(song)
        setIsClicked(true);
        setIsPlaying(true);
    }
  }
  function handleEnd(){
    setArtist(null);
    setTitle(null);
    setIsClicked(false);
    setCurrSong(null);
  }
  useEffect(() => {
    getSearchResults(query).then((data) => setResults(data.results)).then(() => setIsLoaded(true))}, [query])
  function isSongFavorited(song){
    return favorites.some(favorite =>
        favorite.song.title === song.title &&
        favorite.song.artist === song.artist
      );
  }
  return(
    <>
      <div className="search-modal">
        <div className="search-modal-content-container">
            <button className="close-btn" onClick={onClose}>X</button>
            <h2 className="results"><strong>Search Results</strong></h2>
            {isLoaded?
              <div className="modal-content">
                {results.map((song, index) => (
                    <div className="song-info" key={index} onClick={() => handleCardClick(song)}>
                      <div className="card-img-wrapper">
                        <img src={song.coverUrl} alt="song preview Image" className="song-img" onClick={() => handleCardClick(song)}/>
                        <div className="play-pause-button" onClick={(event) => handlePlayPauseClick(song, event)}>
                            {isPlaying && isSongPlaying(song)? <FaPause/> : <FaPlay/>}
                        </div>
                        {isClicked && isSongPlaying(song) && (
                        <AudioPlayer
                          song={song}
                          selectedArtist={artist} selectedTitle={title}
                          isPlaying={isPlaying} onEnd={handleEnd}
                        />
                      )}
                      </div>
                      <div className="song-details">
                        <p className="song-name">{song.title}</p>
                        <p className="artist-name">{song.artist}</p>
                      </div>
                      <div className="favorite-action" title="add to favorites">{isSongFavorited(song)? <FaCheck/> : <IoAddCircleOutline onClick={()=> onSave(song, userLat, userLng)}/>}</div>
                    </div>
              ))}
              </div> : <div className="loading-container"><img src={loading} className="loading"></img></div>}
          </div>
        </div>
    </>
  )}
