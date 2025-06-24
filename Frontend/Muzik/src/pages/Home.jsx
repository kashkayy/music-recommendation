import { useState } from "react"
import { useLocation } from "react-router-dom"
export default function Home(){
  const location = useLocation()
  return(
    <>
      <h3>Welcome {location.state.username}</h3>
    </>
  )
}