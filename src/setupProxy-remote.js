const { createProxyMiddleware } = require("http-proxy-middleware");

// change this to the base url of your remote hosted platform
const target = "https://your-remote-platform";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: false,
      onProxyReq: function (request) {
        request.setHeader("origin", target);
      },
    })
  );
};
