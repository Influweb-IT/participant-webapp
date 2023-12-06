const { createProxyMiddleware } = require("http-proxy-middleware");

const target = "https://influweb.staging.influenzanet.info";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api/": "/api/",
      },
      onProxyReq: function (request) {
        request.setHeader("origin", target);
      },
    })
  );
};
