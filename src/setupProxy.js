const { createProxyMiddleware } = require('http-proxy-middleware');

// const target = "https://influweb.staging.influenzanet.info";

const target = 'http://localhost:3231';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api/v1/': '/v1/',
        '^/api/': '/v1/',
      },
      onProxyReq: function (request) {
        request.setHeader('origin', target);
      },
    })
  );
};
