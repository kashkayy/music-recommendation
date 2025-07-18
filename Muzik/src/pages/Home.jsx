import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ContentContainer from "../containers/ContentContainer";
export default function Home() {
  const [currentSection, setCurrentSection] = useState("home");
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
          fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=${
              import.meta.env.VITE_IP_API_KEY
            }`
          )
            .then((response) => response.json())
            .then((data) => {
              setUserLat(Number(data.latitude));
              setUserLng(Number(data.longitude));
            })
            .catch((error) => {
              setError(error.message);
            });
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);
  return (
    <>
      <Header setCurrentSection={setCurrentSection} />
      <ContentContainer
        currentSection={currentSection}
        userLat={userLat}
        userLng={userLng}
      />
    </>
  );
}
