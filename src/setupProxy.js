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

  // Proxy Streamlit dashboard and its WebSocket to staging
  app.use(
    "/dashboard",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: false,
      ws: true,
    })
  );

  app.use(
    "/_stcore",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: false,
      ws: true,
    })
  );
};
