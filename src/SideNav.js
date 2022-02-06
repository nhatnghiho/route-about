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
  Chip,
} from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import Geocoder from './Geocoder';
import Instructions from './Instructions';

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
  const [finalDistance, setFinalDistance] = useState();

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  const handleProfileChange = (e, newProfile) => {
    setProfile(newProfile);
  };

  async function handleClick() {
    // console.log(origin);
    // console.log(destination);

    let dist = 0;
    let point = turf.point(origin);
    let waypoints = [];
    let res;
    // let count = 0;

    while (dist < distance * 1000 * 0.9) {
      waypoints.push(
        `${point.geometry.coordinates[0]},${point.geometry.coordinates[1]}`
      );
      const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${waypoints.join(
        ';'
      )};${destination[0]},${
        destination[1]
      }?geometries=geojson&steps=true&access_token=${
        props.mapboxgl.accessToken
      }`;

      const query = await fetch(url, { method: 'GET' });
      res = await query.json();
      // console.log(res);

      dist = res.routes[0].distance;

      // console.log('radius = ' + (distance - dist / 1000) / 5);

      if (dist < distance * 1000) {
        const polygon = turf.buffer(
          point,
          // distance / 10
          Math.max((distance - dist / 1000) / 5, 0.25)
        );
        // count += 1;
        point = turf.randomPoint(1, { bbox: turf.bbox(polygon) })[
          'features'
        ][0];
      }
    }

    // console.log('count = ' + count);

    props.addRoutes(res.routes[0].geometry);

    setFinalDistance(
      <Chip
        id='chip'
        label={
          'Total route distance: ' +
          props.handleDistance(res.routes[0].distance)
        }
      ></Chip>
    );

    setTripDirections(
      <Instructions
        id='instructions'
        data={res.routes[0]}
        handleDistance={props.handleDistance}
      ></Instructions>
    );
  }

  return (
    <Card className='sidenav'>
      <Geocoder
        map={map}
        mapboxgl={props.mapboxgl}
        geocoder={originRef}
        elementId='origin'
        color='blue'
        placeholder='Choose a starting place'
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
      <div>{finalDistance}</div>
      <div>{tripDirections}</div>
    </Card>
  );
}

export default SideNav;
