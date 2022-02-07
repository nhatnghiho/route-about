import React, { useRef } from 'react';
import Map from './Map';
import SideNav from './SideNav';
import mapboxgl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './App.css';

var turf = require('@turf/turf');

mapboxgl.accessToken =
  'pk.eyJ1IjoibmhhdG5naGlobyIsImEiOiJja3lxOGY4MmswaGg2MnBudXh1YTU2N3gwIn0.yBNuI6sTbLBiVYgeetvoGA';
mapboxgl.workerClass = MapboxWorker;

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

  function addRoutes(feature) {
    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: feature,
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#03AA46',
        'line-width': 8,
        'line-opacity': 0.8,
      },
    });

    map.current.fitBounds(turf.bbox(feature), {
      padding: { top: 200, bottom: 200, left: 200, right: 200 },
      maxZoom: 20,
    });
  }

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
      <SideNav
        map={map}
        mapboxgl={mapboxgl}
        handleDistance={handleDistance}
        addRoutes={addRoutes}
      />
    </div>
  );
}

export default App;
