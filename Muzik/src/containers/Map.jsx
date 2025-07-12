import { useLocation } from "react-router-dom";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import useFetchClusters from "../hooks/useFetchClusters";
const center = {
  lat: 20.0,
  lng: 0.0,
};
const options = {
  north: 90,
  south: -90,
  east: 180,
  west: -180,
};
function ClusteredMap({ clusters }) {
  return clusters.map((cluster) => (
    <AdvancedMarker
      key={`${cluster.lat}_${cluster.lng}`}
      position={{ lat: cluster.lat, lng: cluster.lng }}
    >
      <div
        style={{
          display: "flex",
          height: "24px",
          width: "24px",
        }}
      >
        {`${cluster.count} saves 🔥`}
      </div>
    </AdvancedMarker>
  ));
}
export default function MapPage({ userLat, userLng, onSave, favorites }) {
  const location = useLocation();
  const { handleMapIdle, clusters } = useFetchClusters();
  return (
    <>
      <h3>Welcome {location.state.username}</h3>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div style={{ height: "85vh", width: "100%" }}>
          <Map
            defaultZoom={2}
            minZoom={2}
            defaultCenter={center}
            mapId={import.meta.env.VITE_MAP_ID}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onIdle={(event) => handleMapIdle(event.map)}
            defaultBounds={options}
          >
            <ClusteredMap clusters={clusters} />
          </Map>
        </div>
      </APIProvider>
    </>
  );
}
