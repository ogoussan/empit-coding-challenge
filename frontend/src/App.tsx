import {ReactElement, useEffect, useState} from "react";
import Form from "./components/Form/Form";
import Map from "./components/Map/Map";
import usePolygon from "./hooks/usePolygon";
import { Backdrop, CircularProgress } from "@mui/material";
import Frame from "./components/Map/Frame";

const App = (): ReactElement => {
  const [selectedPolygonIds, setSelectedPolygonIds] = useState<number[]>([]);
  const { polygonData, polygonLoading, polygonError } =
    usePolygon(selectedPolygonIds);
  const [clickedPolygon, setClickedPolygon] = useState<number>(-1);

  useEffect(() => {
    setClickedPolygon(-1);
  }, [selectedPolygonIds]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: "0 70px",
      }}
    >
      <Form
        selectedPolygonIds={selectedPolygonIds}
        setSelectedPolygonIds={setSelectedPolygonIds}
      />
      <div style={{ position: "relative" }}>
        <div>
          <Map polygons={polygonData} setClickedPolygon={setClickedPolygon} />
        </div>
        <Backdrop
          open={polygonLoading || !!polygonError || clickedPolygon >= 0}
          sx={{ zIndex: 1000, position: "absolute", borderRadius: "6px" }}
        >
          {polygonError ? (
            <div>{polygonError.type}</div>
          ) : clickedPolygon >= 0 ? (
            <Frame
              clickedPolygon={clickedPolygon}
              setClickedPolygon={setClickedPolygon}
            />
          ) : (
            <CircularProgress />
          )}
        </Backdrop>
      </div>
    </div>
  );
};

export default App;
