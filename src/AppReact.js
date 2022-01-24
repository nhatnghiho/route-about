import "./App.css";
import React, { useCallback, useState, useRef } from "react";
import ReactMapGL, {
  Marker,
  Layer,
  Source,
  WebMercatorViewport,
} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
const turf = require("@turf/turf");

function App() {
  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    latitude: 33.7489924,
    longitude: -84.3902644,
    width: "100vw",
    height: "100vh",
    zoom: 10,
  });

  const [start, setStart] = useState();

  const [end, setEnd] = useState();

  const handleViewportChange = useCallback((vp) => setViewport(vp), []);

  const handleGeocoderViewportChange = useCallback((vp) => {
    return handleViewportChange({ ...vp, transitionDuration: 1000 });
  }, []);

  const [feedback, setFeedback] = useState();

  const handleStartChange = useCallback((address) => {
    setStart(address);
  }, []);

  const handleEndChange = useCallback((address) => {
    setEnd(address);
  }, []);

  const findRoutes = () => {
    if (start !== undefined && end !== undefined) {
      console.log(start.result.center);
      console.log(end.result.center);
      const startPoint = turf.point(start.result.center);
      const endPoint = turf.point(end.result.center);

      const polygon = turf.buffer(
        turf.lineString([start.result.center, end.result.center]),
        1,
        { units: "miles", steps: 8 }
      );

      const bbox = turf.bbox(polygon);
      const grid = turf.pointGrid(bbox, 0.1, {
        units: "miles",
        mask: polygon,
      });

      const geojson = grid;

      console.log(JSON.stringify(geojson));

      setFeedback(
        <Source type="geojson" data={geojson}>
          <Layer
            type="circle"
            // layout={{
            //   "line-join": "round",
            //   "line-cap": "round",
            // }}
            paint={{
              "circle-radius": 2,
              "circle-color": "#0091cd",
              // "line-color": "#888",
              // "line-width": 8,
              // "fill-color": "#0091cd",
              // "fill-opacity": 0.2,
              // "fill-outline-color": "#300923",
            }}
          />
        </Source>
      );
    }
  };

  return (
    <div className="App">
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/nhatnghiho/ckyq8sj140wvd15qb7qbom1u5"
        onViewportChange={handleViewportChange}
      >
        {/* <Source
          type="geojson"
          data="https://gis.atlantaga.gov/dpcd/rest/services/OpenDataService/FeatureServer/3/query?where=&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnExceededLimitFeatures=false&quantizationParameters=&returnCentroid=false&sqlFormat=none&resultType=&featureEncoding=esriDefault&datumTransformation=&f=geojson"
        >
          <Layer
            type="fill"
            paint={{
              "fill-color": "#0091cd",
              "fill-opacity": 0.2,
              "fill-outline-color": "#300923",
            }}
          />
        </Source> */}
        <div>
          <Geocoder
            mapRef={mapRef}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            position="top-left"
            // marker={false}
            onResult={handleStartChange}
            onClear={handleStartChange}
            onViewportChange={handleGeocoderViewportChange}
            countries="US"
          ></Geocoder>
        </div>
        <div>
          <Geocoder
            mapRef={mapRef}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            position="top-left"
            // marker={false}
            onResult={handleEndChange}
            onClear={handleEndChange}
            onViewportChange={handleGeocoderViewportChange}
            countries="US"
          ></Geocoder>
        </div>
        <button onClick={findRoutes}>Hello</button>
        {feedback}
      </ReactMapGL>
    </div>
  );
}

export default App;
