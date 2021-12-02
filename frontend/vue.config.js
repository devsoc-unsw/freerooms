module.exports = {
  transpileDependencies: ["vuetify"],
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: true,
    // proxy: "https://freerooms.csesoc.unsw.edu.au/",
    proxy: "http://localhost:3000/",
  },
};
