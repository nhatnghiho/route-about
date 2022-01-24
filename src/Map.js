import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Map() {
  const MapContext = React.createContext;
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-84.3902644);
  const [lat, setLat] = useState(33.7489924);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/nhatnghiho/ckyq8sj140wvd15qb7qbom1u5",
      center: [lng, lat],
      zoom: zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
}

export default Map;
