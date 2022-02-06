import { useEffect } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

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
      if (map.current.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }
    });
  });

  return <div id={props.elementId}></div>;
}

export default Geocoder;
