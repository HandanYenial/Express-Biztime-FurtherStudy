/** BizTime express application. */


const express = require("express");

const app = express();
const ExpressError = require("./expressError")

// Parse request bodies for JSON
app.use(express.json());

const cRoutes = require("./routes/companies");
app.use("/companies", cRoutes);

const iRoutes = require("./routes/invoices");
app.use("/invoices", iRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const e = new ExpressError("Not Found", 404);
  return next(e);
});

/** general error handler */

app.use((e, req, res, next) => {
  res.status(e.status || 500);

  return res.json({
    error: e,
    message: e.message
  });
});


module.exports = app;
