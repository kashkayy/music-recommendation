import SongsContainer from "./SongsContainer"
import MapPage from "./Map"
import Admin from "./Admin"
export default function ContentContainer({currentSection, userLat, userLng}) {
    return(
        <>
            {currentSection === "home" && <SongsContainer userLat={userLat} userLng={userLng} />}
            {currentSection === "map" && <MapPage />}
            {currentSection === "admin" && <Admin />}
        </>
    )
}
