import SearchModal from "../components/SearchResultsModal"
import { useEffect, useState } from "react"
import { getUserFavorites } from "../api";
export default function SongsContainer() {
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        getUserFavorites().then((data) => setFavorites(data.results))},[])
    const [showModal, setShowModal] = useState(false);
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    function handleClick(event){
        event.preventDefault();
        setShowModal(true)
    }
    function handleHide(){
        setShowModal(false)
    }
    return (
    <>
        <div className="search-container">
            <input type="text" placeholder="Search for song" value={query} onChange={(event) => setQuery(event.target.value)} />
            <button onClick={handleClick}>Search</button>
        </div>
        {showModal && <SearchModal query={query} onClose={handleHide} />}
        <div className="recommended-container">
            <h3>Recommended songs for you</h3>
            <div className="recommended-songs">

            </div>

        </div>
        <div className="favorites-container"></div>
            <h2>Your favorites list</h2>
            <div className="favorite-songs">
                {favorites.map(({song}, index) => (
                    <div className="song-card" key={index}>
                        <img className="card-image" src={song.coverUrl}></img>
                        <div className="card-info">
                            <h3 className="card-song">{song.title}</h3>
                            <p className="card-artist">{song.artist}</p>
                        </div>
                        <div className="action">
                            <span className="fav-action"></span>
                        </div>
                    </div>
                ))}
            </div>
    </>
  )
}
