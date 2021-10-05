module.exports = {
  transpileDependencies: ["vuetify"],
  runtimeCompiler: true,
  devServer: {
    proxy: "https://freerooms.csesoc.unsw.edu.au/",
  },
};
