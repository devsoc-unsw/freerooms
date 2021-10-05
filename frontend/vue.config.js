module.exports = {
  transpileDependencies: ["vuetify"],
  runtimeCompiler: true,
  devServer: {
    proxy: "http://localhost:3000",
  },
};

//https://freerooms.csesoc.unsw.edu.au/
