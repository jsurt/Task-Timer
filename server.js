"use strict";
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bodyParser = require("body-parser");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { Solve, User } = require("./models");

const { router: usersRouter } = require("./users");
const { router: authRouter, localStrategy, jwtStrategy } = require("./auth");
const { router: taskRouter } = require("./tasks");

app.use(morgan("common"));
app.use(express.json());
app.use(
  bodyParser.json({
    type: "application/json"
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

const jwtAuth = passport.authenticate("jwt", { session: false });

//Protected endpoint
app.get("/protected", jwtAuth, (req, res) => {
  res.send(req.user);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
  res.status(200);
});

app.get("/timer", (req, res) => {
  res.sendFile(__dirname + "/public/timer.html");
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }

        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      },
      { useNewUrlParser: true }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
