import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useAuth } from "../auth/AuthContext";
import useFetchClusters from "../hooks/useFetchClusters";
import useMapSearch from "../hooks/useMapSearch";
import useDebounce from "../hooks/useDebounce";
import { Spinner } from "react-spinner-toolkit";
import { useState, useEffect } from "react";
import ClusterModal from "../components/clusterModal";
const center = {
  lat: 20.0,
  lng: 0.0,
};
const options = {
  restriction: {
    latLngBounds: {
      north: 90,
      south: -90,
      east: 180,
      west: -180,
    },
    strictBounds: true,
  },
};
function ClusteredMap({ clusters, onClusterClick, onMapReady }) {
  const map = useMap();
  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  return clusters.map((cluster) => (
    <AdvancedMarker
      key={cluster.id}
      position={{ lat: cluster.lat, lng: cluster.lng }}
      onClick={() => {
        if (!map) return;
        const zoom = map.getZoom();
        onClusterClick(cluster, zoom);
      }}
    >
      <div
        style={{
          display: "flex",
          height: "24px",
          width: "24px",
          cursor: "pointer",
        }}
      >
        {`${cluster.count} saved songs 🔥`}
      </div>
    </AdvancedMarker>
  ));
}
export default function MapPage({ userLat, userLng, onSave, favorites }) {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const {
    handleMapIdle,
    clusters,
    fetchClusters,
    handleMarkerClick,
    selectedCluster,
    zoom,
    handleModalClose,
    showModal,
  } = useFetchClusters();
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    handleSearch,
    clearSearch,
  } = useMapSearch();
  const debouncedMapIdle = useDebounce(handleMapIdle, 400);
  function handleMapSearch(event) {
    event.preventDefault();
    if (mapInstance && searchQuery.trim()) {
      handleSearch(searchQuery, mapInstance, handleMapIdle);
    }
  }
  return (
    <>
      <div className="map-header">
        <h3 style={{ marginLeft: "1.5rem", fontSize: "1rem" }}>
          Welcome {user.username}
        </h3>
        <div>
          <form onSubmit={handleMapSearch} className="map-form">
            <input
              type="text"
              placeholder="Discover music in..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              disabled={isSearching}
            />
            <button className="map-search">{isSearching ? "..." : "🔍"}</button>
            {searchQuery && (
              <button className="map-search" onClick={clearSearch}>
                x
              </button>
            )}
          </form>
        </div>
      </div>
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          setIsLoaded(true);
          fetchClusters();
        }}
      >
        {isLoaded ? (
          <div style={{ height: "83vh", width: "100%" }}>
            <Map
              defaultZoom={2}
              minZoom={2}
              defaultCenter={center}
              mapId={import.meta.env.VITE_MAP_ID}
              gestureHandling="greedy"
              disableDefaultUI={false}
              onIdle={(event) => debouncedMapIdle(event.map)}
              options={options}
            >
              <ClusteredMap
                clusters={clusters}
                onClusterClick={handleMarkerClick}
                onMapReady={setMapInstance}
              />
              {showModal && (
                <ClusterModal
                  lat={selectedCluster.lat}
                  lng={selectedCluster.lng}
                  onClose={handleModalClose}
                  onSave={onSave}
                  userLat={userLat}
                  userLng={userLng}
                  favorites={favorites}
                  zoom={zoom}
                />
              )}
            </Map>
          </div>
        ) : (
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
        )}
      </APIProvider>
    </>
  );
}
