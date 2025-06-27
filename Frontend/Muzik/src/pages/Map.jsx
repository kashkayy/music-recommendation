import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"
import { getLocations } from "../api"
import MarkerModal from "../components/LocationModal"
  const center = {
    lat: 0,
    lng: 0
  }
  const containerStyle = {
    width: '1000px',
    height: '1000px'
  }
  const options = {
  restriction: {
    latLngBounds: {
      north: 85,
      south: -85,
      west: -180,
      east: 180,
    },
    strictBounds: true,
  },
};
export default function MapPage(){
  const [showModal, setShowModal] = useState(false);
  const [markers, setMarkers] = useState([])
  const [activeMarker, setActiveMarker] = useState({})
  useEffect(() => {
    getLocations().then((data) => setMarkers(data.results));
  }, []);
  const location = useLocation()
  const{isLoaded} = useLoadScript({
    googleMapsApiKey : import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })
  if(!isLoaded) return <span>Loading...</span>
  function handleClick(marker){
    setActiveMarker(marker)  
    setShowModal(true)};
  function onCloseModal(){
    setActiveMarker({})
    setShowModal(false)
  }
  const locations = markers.map((marker, id) => <Marker key={id} position={{lat: marker.lat, lng: marker.lng}} onClick={() => handleClick(marker)}/>)
  return(
    <>
      <h3>Welcome {location.state.username}</h3>
      <GoogleMap center={center} zoom={2} maxzoom={10} mapContainerStyle={containerStyle} options={options}>
        {locations}
        {showModal && activeMarker && <MarkerModal marker={activeMarker} onClose={onCloseModal}/>}
      </GoogleMap>
    </>
  )
}