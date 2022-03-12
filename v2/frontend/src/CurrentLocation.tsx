import { map, view } from "./Basemap";
import Locate from "@arcgis/core/widgets/Locate";
import Graphic from "@arcgis/core/Graphic";
import { simpleMarkerSymbol, simpleMarkerSymbol2 } from "./Marker";
// display current location
let locateWidget = new Locate({
  view: view, // Attaches the Locate button to the view
  graphic: new Graphic({
    symbol: simpleMarkerSymbol2,
  }),
});

view.ui.add(locateWidget, "top-right");

export default locateWidget;
