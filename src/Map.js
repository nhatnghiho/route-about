import React, { useRef, useEffect, useState } from 'react';

function Map(props) {
  const map = props.map;
  const mapContainerRef = props.mapContainerRef;
  const mapboxgl = props.mapboxgl;

  // const [directions, setDirections] = useState();

  // const [lng, setLng] = useState(-84.3902644);
  // const [lat, setLat] = useState(33.7489924);
  // const [zoom, setZoom] = useState(10);

  const [lng, setLng] = useState(props.lng);
  const [lat, setLat] = useState(props.lat);
  const [zoom, setZoom] = useState(props.zoom);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/nhatnghiho/ckyq8sj140wvd15qb7qbom1u5',
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return <div id='main' className='map-container' ref={mapContainerRef} />;
}

export default Map;
