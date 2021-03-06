// 'use strict';

var a127 = require("a127-magic");
var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const todoRoute = require("./api/routes/todoRoutes");
const userRoute = require("./api/routes/userRoutes");

var app = express();

// allows api access from different origins]
app.use(cors());
app.options("*", cors());

// parses the incoming datas
// ({ type: "application/*+json" }
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// mongoose.connect(process.env.LOCAL_MONGO, {
//   useNewUrlParser: true
// });

mongoose.connect(process.env.MONGO, { useNewUrlParser: true });

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
