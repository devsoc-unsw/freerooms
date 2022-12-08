// If building is not yet clicked, it will be orange with a white outline 
const openFeature = {
  "type": "simple",
  "symbol": {
    "type": "simple-marker",
    "style": "circle",
    "size": "18px",
    "color": "#C64D2A", 
    "outline": {  
      "color": "white",
      "width": 4
    }
  }
};

// If building is clicked, it will be black with a white outline
const clickedFeature = {
  "type": "simple",
  "symbol": {
    "type": "simple-marker",
    "style": "circle",
    "size": "18px",
    "color": "black", 
    "outline": {  
      "color": "white",
      "width": 4
    }
  }
};

export { openFeature, clickedFeature }