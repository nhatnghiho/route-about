import React, { useState, useRef } from 'react';
import Map from './Map';
import SideNav from './SideNav';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function App() {
  const mapContainerRef = useRef(null);
  const map = useRef(null);

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
      <SideNav map={map} mapboxgl={mapboxgl} />
    </div>
  );
}

export default App;
