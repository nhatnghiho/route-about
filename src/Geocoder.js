import { useEffect } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

function Geocoder(props) {
  const map = props.map;
  const mapboxgl = props.mapboxgl;
  const geocoder = props.geocoder;

  useEffect(() => {
    geocoder.current = new MapboxGeocoder({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      mapboxgl: mapboxgl,
      marker: {
        color: props.color,
      },
      placeholder: props.placeholder,
      zoom: 10,
      country: 'US',
    });

    document
      .getElementById(props.elementId)
      .appendChild(geocoder.current.onAdd(map.current));
  }, []);

  useEffect(() => {
    geocoder.current.on('result', (e) => {
      props.onResult(e.result.center);
    });
  });

  return <div id={props.elementId}></div>;
}

export default Geocoder;
