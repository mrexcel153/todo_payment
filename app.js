// 'use strict';

var a127 = require("a127-magic");
var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const todoRoute = require("./api/routes/todoRoutes");
const userRoute = require("./api/routes/userRoutes");

var app = express();

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });

// allows api access from different origins]
app.use(cors());
app.options("*", cors());

// parses the incoming datas
// ({ type: "application/*+json" }
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/UpgradedTodo", {
  useNewUrlParser: true
});

// mongoose.connect(
//   "mongodb://heroku_hwldkxwb:AqCzdpNL!jzZt5h@ds119490.mlab.com:19490/heroku_hwldkxwb",
//   { useNewUrlParser: true }
// );

// routes for todo activities
app.use("/api/v1/todos", todoRoute);

// routes for users details
app.use("/api/v1/users", userRoute);

module.exports = app; // for testing

// initialize a127 framework
a127.init(function(config) {
  // include a127 middleware
  app.use(a127.middleware(config));

  // error handler to emit errors as a json string
  app.use(function(err, req, res, next) {
    if (typeof err !== "object") {
      // If the object is not an Error, create a representation that appears to be
      err = {
        message: String(err) // Coerce to string
      };
    } else {
      // Ensure that err.message is enumerable (It is not by default)
      Object.defineProperty(err, "message", { enumerable: true });
    }

    // Return a JSON representation of #/definitions/ErrorResponse
    res.set("Content-Type", "application/json");
    res.end(JSON.stringify(err));
  });

  // var ip = process.env.IP || 'localhost';
  // var port = process.env.PORT || 3000;
  // begin listening for client requests
  // app.listen(port, ip);
});
