import SimpleRenderer from "esri/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";

// If building is not yet clicked, it will be orange with a white outline 
const simpleMarker = new SimpleMarkerSymbol({
  style: "circle", 
  size: "18px",
  color: "#C64D2A", 
  outline: {
    color: "white", 
    width: 4
  }
});

const openFeature = new SimpleRenderer({
  symbol: simpleMarker
});

// If building is clicked, it will be black with a white outline
const simpleMarker2 = new SimpleMarkerSymbol({
  style: "circle", 
  size: "18px",
  color: "black", 
  outline: {
    color: "white", 
    width: 4
  }
});

const clickedFeature = new SimpleRenderer({
  symbol: simpleMarker2
});

export { clickedFeature,openFeature }