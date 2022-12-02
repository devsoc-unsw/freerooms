const simpleMarkerSymbol = {
  type: "simple-marker",
  color: [226, 119, 40], // Orange
  outline: {
    color: [255, 255, 255], // White
    width: 1,
  }
};

let simpleMarkerSymbol2 = {
  type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
  style: "circle",
  color: "dodgerblue",
  size: "20px", // pixels
  outline: {
    // autocasts as new SimpleLineSymbol()
    color: [255, 255, 0],
    width: 3, // points
  },
};

export { simpleMarkerSymbol, simpleMarkerSymbol2 };