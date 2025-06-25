import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"
import { getLocations } from "../api"
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
  const [markers, setMarkers] = useState([])
  useEffect(() => {
    getLocations().then((data) => setMarkers(data.results));
  }, []);
  const location = useLocation()
  const{isLoaded} = useLoadScript({
    googleMapsApiKey : import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })
  if(!isLoaded) return <span>Loading...</span>
  const locations = markers.map((marker, id) => <Marker key={id} position={{lat: marker.lat, lng: marker.lng}} onClick={() => console.log("Please work")}/>)
  return(
    <>
      <h3>Welcome {location.state.username}</h3>
      <GoogleMap center={center} zoom={2} maxzoom={10} mapContainerStyle={containerStyle} options={options}>
        {locations}
      </GoogleMap>
    </>
  )
}