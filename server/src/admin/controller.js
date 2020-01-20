const cors = require('cors');
const express = require('express');
const adminMetrics = require('./metrics');
const errorLogger = require('./error_logger');
const { ForbiddenError } = require('apollo-server-express');

module.exports = function adminController(app) {
  app.use(cors());
  app.use(express.json());

  app.get("/admin/api", async (req, res) => {
    console.log(req.headers);
    console.log("secret:", process.env.ADMIN_SECRET);

    if (req.headers.admintoken !== process.env.ADMIN_SECRET)
      res.send(403);
    const data = await adminMetrics(req);
    res.set("Access-Control-Allow-Credentials", true);
    res.send(data);
  });

  app.post("/admin/error", async (req, res) => {
    errorLogger(req.body);
  });
};
