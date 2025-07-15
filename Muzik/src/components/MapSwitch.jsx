import { useLocation } from "react-router-dom";
import { MODE } from "../utils/constants";
import MapPage from "../containers/Map";
import useMapSwitch from "../hooks/useMapSwitch";
export default function MapSwitch({ userLat, userLng, onSave, favorites }) {
  const location = useLocation();
  const { currMode, handleClick } = useMapSwitch();
  function renderMap(mode) {
    if (mode === MODE.LIVE) {
      return (
        <MapPage
          userLat={userLat}
          userLng={userLng}
          onSave={onSave}
          favorites={favorites}
        />
      );
    } else {
      return <div> TEST MAP</div>;
    }
  }
  return (
    <>
      <div className="map-switch">
        <button
          onClick={() => {
            handleClick(MODE.LIVE);
          }}
        >
          {MODE.LIVE}
        </button>
        <h3>Welcome {location.state.username}</h3>
        <button
          onClick={() => {
            handleClick(MODE.EXPLORE);
          }}
        >
          {MODE.EXPLORE}
        </button>
      </div>
      {renderMap(currMode)}
    </>
  );
}
