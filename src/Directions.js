import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import './Directions.css';
import React, { useRef, useEffect, useState } from 'react';

// NOT USED
function Directions(props) {
  const map = props.map;
  const directions = props.directions;

  const [temp, setTemp] = useState(0);
  const [routeActive, setRouteActive] = useState(0);

  useEffect(() => {
    if (directions.current || !map.current) return;

    directions.current = new MapboxDirections({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      profile: 'mapbox/driving',
      alternatives: false,
      geometries: 'geojson',
      interactive: false,
      position: 'top-left',
    });

    document
      .getElementById('directions')
      .appendChild(directions.current.onAdd(map.current));
    // map.current.addControl(directions.current, "top-right");
  }, []);

  useEffect(() => {
    directions.current.on('load', (e) => {
      setTemp(0);
      directions.current.removeRoutes();
    });
  });

  // useEffect(() => {
  //   directions.current.on("origin", () => {
  //     const num = directions.current.getWaypoints().length;

  //     for (let i = 1; i < num - 1; i++) {
  //       directions.current.removeWaypoint(i);
  //
  //   });
  // });

  return <div id='directions'></div>;
}

export default Directions;
