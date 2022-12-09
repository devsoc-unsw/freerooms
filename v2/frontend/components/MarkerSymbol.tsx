import { loadModules } from 'esri-loader';

const loadSymbols = async () => {
  const [SimpeRenderer, SimpleMarker] = await loadModules(["esri/renderers/SimpleRenderer", "esri/symbols/SimpleMarkerSymbol"]);
  // If building is not yet clicked, it will be orange with a white outline 
  const simpleMarker = SimpleMarker({
    style: "circle", 
    size: "18px",
    color: "#C64D2A", 
    outline: {
      color: "white", 
      width: 4
    }
  });

  const openFeature = new SimpeRenderer({
    symbol: simpleMarker
  });

  // If building is clicked, it will be black with a white outline
  const simpleMarker2 = new SimpleMarker({
    style: "circle", 
    size: "18px",
    color: "black", 
    outline: {
      color: "white", 
      width: 4
    }
  });

  const clickedFeature = new SimpeRenderer({
    symbol: simpleMarker2
  });

  return { clickedFeature, openFeature }
}

export default loadSymbols;