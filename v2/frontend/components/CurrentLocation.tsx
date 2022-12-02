// import mapping from "./BaseMap"
// import { loadCss, loadModules } from "esri-loader";
// import { simpleMarkerSymbol, simpleMarkerSymbol2 } from "./Marker";

// export const locateWidget(mapView): Promise<Locate> {
//   const mappingInstance = new mapping();
//   type MyModules = [
//     typeof import("esri/Graphic"), 
//     typeof import("esri/widgets/Locate")
//   ];
//   const [Graphic, Locate] = await (loadModules([
//     "esri/Graphic", 
//     "esri/widgets/Locate"
//   ]) as Promise<MyModules>);
  
//   let locateWidget = new Locate({
//     view: mappingInstance.mapView, // Attaches the Locate button to the view
//     graphic: new Graphic({
//       symbol: simpleMarkerSymbol2,
//     })
//   });
  
//   mappingInstance.mapView.ui.add(locateWidget, "top-right");
// }

// export default locateWidget;