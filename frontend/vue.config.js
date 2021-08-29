module.exports = {
  transpileDependencies: ["vuetify"],
  runtimeCompiler: true,
  devServer: {
    proxy: "http://localhost:1337",
  },
};
