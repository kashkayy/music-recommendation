import SongsContainer from "./SongsContainer"
import MapPage from "./Map"
export default function ContentContainer({currentSection, userLat, userLng}) {
    return(
        <>
            {currentSection === "home" && <SongsContainer userLat={userLat} userLng={userLng} />}
            {currentSection === "map" && <MapPage />}
        </>
    )
}
