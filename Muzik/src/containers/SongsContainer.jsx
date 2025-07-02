import SearchModal from "../components/SearchResultsModal"
import { useEffect, useState } from "react"
import { getUserFavorites, deleteSavedSong, saveSong } from "../api";
import { IoRemoveCircleOutline } from "react-icons/io5";
export default function SongsContainer({userLat, userLng}) {
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        getUserFavorites().then((data) => setFavorites(data.results))},[])
    const [showModal, setShowModal] = useState(false);
    const [query, setQuery] = useState("");
    function handleClick(event){
        event.preventDefault();
        setShowModal(true)
    }
    function handleHide(){
        setShowModal(false)
    }
    function handleRemove(songId){
        deleteSavedSong(songId).then(data => {
            if (data.ok) {setFavorites(data.results)}
        });
    }
    function handleAddToFavorite(song, lat, lng){
        saveSong(song.id, lat, lng, song.title, song.artist, song.coverUrl).then(data => {
            if (data.ok) {setFavorites(data.results)}
         })
    }
    return (
    <>
        <div className="search-container">
            <input type="text" placeholder="Search for song" value={query} onChange={(event) => setQuery(event.target.value)} />
            <button onClick={handleClick}>Search</button>
        </div>
        {showModal && <SearchModal query={query} onClose={handleHide} onSave={handleAddToFavorite} userLat={userLat} userLng={userLng}/>}
        <div className="recommended-container">
            <h3 className="songs-header">Recommended songs for you</h3>
            <div className="recommended-songs">
            </div>
        </div>
        <div className="favorites-container"></div>
            <h2 className="songs-header">Your favorites list</h2>
            <div className="favorite-songs">
                {favorites.map((favorite, index) => (
                    <div className="song-card" key={index}>
                        <img className="card-image" src={favorite.song.coverUrl}></img>
                        <div className="card-info">
                            <h3 className="card-song">{favorite.song.title}</h3>
                            <p className="card-artist">{favorite.song.artist}</p>
                        </div>
                        <div className="action">
                            <div><IoRemoveCircleOutline className="delete-action" onClick={() => handleRemove(favorite.songId)} title="Remove from favorites"/></div>
                        </div>
                    </div>
                ))}
            </div>
    </>
  )
}
