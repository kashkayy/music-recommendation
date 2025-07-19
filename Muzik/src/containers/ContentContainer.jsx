import SongsContainer from "./SongsContainer";
import { getUserFavorites, saveSong } from "../api";
import { useState, useEffect } from "react";
import MapPage from "./Map";
import { Notify } from "../utils/toast";
import { Spinner } from "react-spinner-toolkit";
export default function ContentContainer({ currentSection, userLat, userLng }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    getUserFavorites()
      .then((data) => setFavorites(data.results))
      .catch((error) => Notify())
      .finally(() => setIsLoaded(true));
  }, []);
  const handleAddToFavorite = async (song, lat, lng) => {
    await saveSong(
      song.id,
      lat,
      lng,
      song.title,
      song.artist,
      song.coverUrl
    ).then((data) => {
      if (data.ok) {
        setFavorites(data.results);
      }
    });
  };
  if (!isLoaded) {
    return (
      <div className="loading-container">
        <Spinner
          shape="threeDots"
          color="#888"
          loading
          speed={1}
          size={300}
          transition={true}
        />
      </div>
    );
  }
  return (
    <>
      {currentSection === "home" && (
        <SongsContainer
          userLat={userLat}
          userLng={userLng}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}
      {currentSection === "map" && (
        <MapPage
          userLat={userLat}
          userLng={userLng}
          onSave={handleAddToFavorite}
          favorites={favorites}
        />
      )}
    </>
  );
}
