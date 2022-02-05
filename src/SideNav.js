import { useRef, useState } from 'react';
import {
  Card,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Container,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import Geocoder from './Geocoder';
import { useSlider } from '@mui/base';

var turf = require('@turf/turf');

function SideNav(props) {
  const map = props.map;

  const originRef = useRef(null);
  const [origin, setOrigin] = useState();
  const destinationRef = useRef(null);
  const [destination, setDestination] = useState();

  const [distance, setDistance] = useState(3);
  const [profile, setProfile] = useState('walking');

  const [tripDirections, setTripDirections] = useState('');

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  const handleProfileChange = (e, newProfile) => {
    setProfile(newProfile);
  };

  async function handleClick() {
    console.log(origin);
    console.log(destination);

    let dist = 0;
    let point = turf.point(destination);
    console.log('point = ' + JSON.stringify(point));
    let waypoints = '';
    let res;
    let count = 0;

    while (dist < distance * 1000 * 0.9) {
      console.log('test = ' + point.geometry.coordinates[0]);
      waypoints =
        `;${point.geometry.coordinates[0]},${point.geometry.coordinates[1]}` +
        waypoints;
      const url =
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]}` +
        waypoints +
        `?geometries=geojson&steps=true&access_token=${props.mapboxgl.accessToken}`;

      const query = await fetch(url, { method: 'GET' });
      res = await query.json();
      dist = res.routes[0].distance;
      console.log(res);

      console.log('radius = ' + (distance - dist / 1000) / 5);

      if (dist < distance * 1000) {
        const polygon = turf.buffer(
          point,
          distance / 10
          // Math.max((distance - dist / 1000) / 5, 0.25)
        );
        count += 1;
        point = turf.randomPoint(1, { bbox: turf.bbox(polygon) })[
          'features'
        ][0];
      }
    }

    console.log('count = ' + count);

    setTripDirections(
      <ul>
        {res.routes[0].legs.map((leg) =>
          leg.steps.map((step) => <li>{step.maneuver.instruction}</li>)
        )}
      </ul>
    );

    console.log('distance = ' + res.routes[0].distance);
    addRoutes(res.routes[0].geometry);
  }

  function addRoutes(coords) {
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
          geometry: coords,
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
  }

  // const handleSetOrigin = (result) => {
  //   // console.log('result: ' + result);
  //   setOrigin(result);
  //   console.log(origin);
  // };

  return (
    <Card className='sidenav'>
      <Geocoder
        map={map}
        mapboxgl={props.mapboxgl}
        geocoder={originRef}
        elementId='origin'
        color='blue'
        placeholder='Choose a starting place'
        // onResult={handleSetOrigin}
        onResult={setOrigin}
      ></Geocoder>
      <Geocoder
        map={map}
        mapboxgl={props.mapboxgl}
        geocoder={destinationRef}
        elementId='destination'
        color='orange'
        placeholder='Choose destination'
        onResult={setDestination}
      ></Geocoder>
      <Container id='form'>
        <FormControl variant='filled' id='distance-form'>
          <InputLabel id='distance'>Distance</InputLabel>
          <Select
            labelId='distance'
            value={distance}
            onChange={handleDistanceChange}
          >
            <MenuItem value={3}>3 Miles</MenuItem>
            <MenuItem value={5}>5 Miles</MenuItem>
            <MenuItem value={7}>7 Miles</MenuItem>
            <MenuItem value={10}>10 Miles</MenuItem>
          </Select>
        </FormControl>
        <ToggleButtonGroup
          exclusive
          value={profile}
          onChange={handleProfileChange}
        >
          <ToggleButton value='walking'>
            <DirectionsWalkIcon />
          </ToggleButton>
          <ToggleButton value='cycling'>
            <DirectionsBikeIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Container>
      <Button
        id='submit'
        variant='filled'
        endIcon={<NavigationIcon />}
        onClick={handleClick}
      >
        Navigate
      </Button>
      <div>{tripDirections}</div>
    </Card>
  );
}

export default SideNav;
