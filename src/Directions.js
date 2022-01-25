import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import React, { useRef, useEffect, useState } from "react";
import polyline from "@mapbox/polyline";

var turf = require("@turf/turf");

function Directions(props) {
  const map = props.map;

  const [temp, setTemp] = useState(0);
  const [temp2, setTemp2] = useState(0);

  let bbox = [0, 0, 0, 0];
  let polygon = turf.bboxPolygon(bbox);
  let point = turf.point([0, 0]);

  const directions = useRef(null);

  useEffect(() => {
    if (directions.current || !map.current) return;

    directions.current = new MapboxDirections({
      //   container: mapContainerRef.current,
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      profile: "mapbox/driving",
      alternatives: false,
      geometries: "geojson",
      interactive: false,
    });
    map.current.addControl(directions.current, "top-right");
  });

  useEffect(() => {
    directions.current.on("load", (e) => {
      setTemp(0);
      directions.current.removeRoutes();
    });
  });

  useEffect(() => {
    directions.current.on("clear", () => {
      map.current.setLayoutProperty("bbox", "visibility", "none");
    });
  });

  useEffect(() => {
    map.current.on("styledata", () => {
      if (temp2 !== 0) return;

      map.current.addSource("bbox", {
        type: "geojson",
        data: {
          type: "Feature",
        },
      });
      map.current.addLayer({
        id: "bbox",
        source: "bbox",
        type: "fill",
        paint: {
          "fill-color": "#FFC300",
          "fill-opacity": 0.5,
          "fill-outline-color": "#FFC300",
        },
      });
      setTemp2(1);
    });
  });

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    directions.current.on("route", (e) => {
      console.log(map.current.isStyleLoaded());
      if (temp !== 0 || temp2 === 0) return;

      if (counter > 6) {
        return;
      }
      setCounter(counter + 1);
      for (const route of e.route) {
        console.log("all: " + JSON.stringify(e));
        console.log(route);
        // setTemp(route);

        console.log(
          "end: " + JSON.stringify(directions.current.getDestination())
        );

        console.log(directions.current.getDestination().geometry.coordinates);

        polygon = turf.buffer(directions.current.getDestination().geometry, 5);
        console.log(polygon);
        point = turf.randomPoint(1, { bbox: turf.bbox(polygon) });
        console.log(point);

        directions.current.setWaypoint(
          0,
          point["features"][0].geometry.coordinates
        );

        map.current.getSource("bbox").setData(polygon);
        map.current.setLayoutProperty("bbox", "visibility", "visible");
      }
      setTemp(1);
    });
  });

  //   useEffect(() => {
  //     directions.setWayPoint(0);
  //   });
  return <div></div>;
}

export default Directions;
