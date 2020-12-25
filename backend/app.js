/** CalControl express app. */

const express = require("express");
const usersRoutes = require("./routes/users");
const weightsRoutes = require("./routes/weights");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", usersRoutes);
app.use("/weights", weightsRoutes);


/** 404 Not Found handler. */

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/** Generic error handler. */

app.use(function (err, req, res, next) {
  if (err.stack) console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message,
  });
});


module.exports = app;