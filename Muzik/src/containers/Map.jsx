import { useState } from "react"
import { useLocation } from "react-router-dom"
import {GoogleMap, useLoadScript} from "@react-google-maps/api"
import MarkerModal from "../components/LocationModal"
  const center = {
    lat: 20.0,
    lng: 0.0
  }
  const containerStyle = {
    width: '100%',
    height: '80vh'
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
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const location = useLocation()
  const{isLoaded} = useLoadScript({
    googleMapsApiKey : import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })
  if(!isLoaded) return <span>Loading...</span>
  function handleClick(event){
    setLat(event.latLng.lat())
    setLng(event.latLng.lng())
    setShowModal(true)};
  function onCloseModal(){
    setShowModal(false)
    setLat(null)
    setLng(null)
  }
  return(
    <>
      <h3>Welcome {location.state.username}</h3>
      <GoogleMap center={center} zoom={3} mapContainerStyle={containerStyle} options={options} onClick={handleClick}>
        {showModal && <MarkerModal lat={lat} lng={lng} onClose={onCloseModal}/>}
      </GoogleMap>
    </>
  )
}
