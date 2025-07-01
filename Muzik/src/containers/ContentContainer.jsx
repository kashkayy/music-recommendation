import { useState } from "react"
import SongsContainer from "./SongsContainer"
import MapPage from "./Map"
export default function ContentContainer({currentSection}) {
    return(
        <>
            {currentSection === "home" && <SongsContainer />}
            {currentSection === "map" && <MapPage />}
        </>
    )
}
