import SearchModal from "../components/SearchResultsModal"
import { useState } from "react"
export default function SongsContainer() {
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
            <h3>Your favorites list</h3>
            <div className="favorite-songs">

            </div>
    </>
  )
}
