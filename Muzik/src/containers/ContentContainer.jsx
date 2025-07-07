import SongsContainer from "./SongsContainer"
import MapPage from "./Map"
import Admin from "../pages/Admin"
import {getUserFavorites, saveSong} from "../api"
import {useState, useEffect} from "react"
export default function ContentContainer({currentSection, userLat, userLng}) {
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        getUserFavorites().then((data) => setFavorites(data.results));
    }, [])
    const handleAddToFavorite = async (song, lat, lng) => {
    await saveSong(song.id, lat, lng, song.title, song.artist, song.coverUrl).then(data => {
            if (data.ok) {setFavorites(data.results)}
        })
    }
    return(
        <>
            {currentSection === "home" && <SongsContainer userLat={userLat} userLng={userLng} favorites={favorites} setFavorites={setFavorites}/>}
            {currentSection === "map" && <MapPage userLat={userLat} userLng={userLng} onSave={handleAddToFavorite} favorites={favorites}/>}
            {currentSection === "admin" && <Admin />}
        </>
    )
}
