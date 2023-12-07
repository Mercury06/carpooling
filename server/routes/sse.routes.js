const Router = require("express");
const sse = require("./../utils/sse.js");

const sseRouter = new Router();

sseRouter.get("/stream/:userId", (req, res) => {
  sse.init(req, res);
});

module.exports = sseRouter;
