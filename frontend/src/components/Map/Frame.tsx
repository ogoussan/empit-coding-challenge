import Plotly from 'plotly.js-dist-min'
import {ReactElement, useEffect} from "react";
import {Button} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

type FrameProps = {
  clickedPolygon: number;
  setClickedPolygon: React.Dispatch<React.SetStateAction<number>>;
};

const getEndValue = (exponent: number) => {
  return Math.pow(1_000_000, 1 / exponent)
}



const Frame = ({
  clickedPolygon,
  setClickedPolygon,
}: FrameProps): ReactElement => {
  const generatePlotData = (plotFunction: (x: number) => number, startValue = 0, endValue = 1_000_000, step = 1): {x: number[], y: number[]} => {
    const xArray = [];
    const yArray = [];

    for (let x = startValue; x <= endValue; x+=step) {
      xArray.push(x);
      yArray.push(plotFunction(x));
    }

    return ({
      x: xArray,
      y: yArray,
    })
  }

  useEffect(() => {
     if (clickedPolygon > 0) {
       const frame = document.getElementById('frame');
       Plotly.newPlot( frame,
         [
           generatePlotData((x) => Math.pow(x, clickedPolygon),
             0,
             getEndValue(clickedPolygon),
             getEndValue(clickedPolygon)/100)]
       );
     }
  }, [clickedPolygon]);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        margin: "100px",
        padding: "8px",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{display: "flex", justifyContent:"space-between", width: "100%"}}>
        <h3>Polygon Plot: f(x) = x^{clickedPolygon}</h3>
        <Button onClick={() => setClickedPolygon(-1)}>
          <CloseIcon />
        </Button>
      </div>
      <div id='frame' style={{flex: "1"}} />
    </div>
  );
};

export default Frame;
