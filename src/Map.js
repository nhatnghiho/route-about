import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Directions from "./Directions";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Map() {
  const mapContainerRef = useRef(null);
  const map = useRef(null);

  const [directions, setDirections] = useState();

  const [lng, setLng] = useState(-84.3902644);
  const [lat, setLat] = useState(33.7489924);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/nhatnghiho/ckyq8sj140wvd15qb7qbom1u5",
      center: [lng, lat],
      zoom: zoom,
    });

    setDirections(
      <Directions
        // ref={map}
        map={map}
        mapContainerRef={mapContainerRef}
      />
    );
  });

  useEffect(() => {
    if (!map.current) return;
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div id="main" className="map-container" ref={mapContainerRef}>
        {directions}
      </div>
    </div>
  );
}

export default Map;
