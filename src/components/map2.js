import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import bbox from "@turf/bbox"
import { multiPoint } from "@turf/helpers"
import Markers from "./markers"
import "mapbox-gl/dist/mapbox-gl.css"

// replace with your own Mapbox token
const MAPBOX_TOKEN = "pk.eyJ1IjoiZWRiYXJyaW9zNSIsImEiOiJMSERTSzdnIn0.3t10s7RCakxRvUxZ0scJbQ"

const mapContainerStyle = {
  width: "100%",
  height: "444px",
}

const places = [
  {
    name: "Oficinas EDOMEX.",
    longitude: -99.245,
    latitude: 19.517,
  },
  {
    name: "Oficinas QRO.",
    longitude: -100.392,
    latitude: 20.598,
  },
]

const Map = () => {
  const mapContainerRef = useRef(null)

  const [map, setMap] = useState(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/edbarrios5/cjlkr8q7h2a2w2rmewbyq76k6",
      // Empire State Building [lng, lat]
      center: [-99.881,19.941],
      zoom: 6,
    })

    map.addControl(new mapboxgl.NavigationControl(), "top-right")

    setMap(map)

    return () => map.remove()
  }, [])

  useEffect(() => {
    if (!map) return

    if (places.length !== 0) {
      const coords = []
      places.forEach(place => {
        coords.push([place.longitude, place.latitude])
      })
      const feature = multiPoint(coords)
      const box = bbox(feature)

      map.fitBounds(
        [
          [box[0], box[1]],
          [box[2], box[3]],
        ],
        {
          padding: 40,
          maxZoom: 7,
          duration: 2000,
        }
      )
    } else {
      map.easeTo({
        center: [-99.881,19.941],
        zoom: 6,
        duration: 2000,
      })
    }
  }, [map])

  return (
    <div ref={mapContainerRef} style={mapContainerStyle}>
      {places && map && <Markers map={map} places={places} />}
    </div>
  )
}

export default Map
