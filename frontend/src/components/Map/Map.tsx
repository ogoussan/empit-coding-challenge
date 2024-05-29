import { Path } from "leaflet";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Polygon } from "../../types";
import { useEffect, useState } from "react";

type MapProps = {
  polygons: Polygon[];
  setClickedPolygon: React.Dispatch<React.SetStateAction<number>>;
};

const Map = ({ polygons, setClickedPolygon }: MapProps): JSX.Element => {
  const [geoObjects, setGeoObjects] = useState<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
  const [index, setIndex] = useState<number>(0);

  const onEachFeature = (feature: GeoJSON.Feature, layer: Path) => {
    layer.on({
      click: () => {
        feature?.properties?.id && setClickedPolygon(feature.properties.id);
      },
    });
  };

  const getFeatureStyle = () => {
    return {
      fillColor: "red",
      weight: 2,
      color: "red",
      fillOpacity: 0.3,
    };
  };

  useEffect(() => {
    setGeoObjects({
      type: "FeatureCollection",
      features: polygons.map((polygon) => {
        return {
          type: "Feature",
          properties: {
            id: polygon.id,
          },
          geometry: {
            type: "Polygon",
            coordinates: [polygon.coordinates],
          },
        };
      }),
    });
    // GeoJSON does not update on state change otherwise
    setIndex(index + 1);
  }, [index, polygons]);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <MapContainer
        style={{
          height: "70vh",
          borderRadius: "8px",
        }}
        center={[52.52, 13.405]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          key={index}
          onEachFeature={onEachFeature}
          data={geoObjects}
          style={getFeatureStyle}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
