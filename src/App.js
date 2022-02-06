import React, { useState, useRef } from 'react';
import Map from './Map';
import SideNav from './SideNav';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './App.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function App() {
  const mapContainerRef = useRef(null);
  const map = useRef(null);

  const handleDistance = (distance) => {
    distance = distance / 1000;

    if (distance > 0.2) {
      return distance.toFixed(1) + ' miles';
    } else {
      return (distance * 5280).toFixed(0) + ' feet';
    }
  };

  return (
    <div>
      <Map
        map={map}
        mapContainerRef={mapContainerRef}
        mapboxgl={mapboxgl}
        lng={-84.3902644}
        lat={33.7489924}
        zoom={10}
      />
      <SideNav map={map} mapboxgl={mapboxgl} handleDistance={handleDistance} />
    </div>
  );
}

export default App;
