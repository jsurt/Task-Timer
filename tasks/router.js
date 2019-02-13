"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { Task } = require("../models");
const passport = require("passport");
const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate("jwt", { session: false });

router.get("/", (req, res) => {
  Task.find({ userId: req.user.id })
    .then(tasks => {
      res.json({
        tasks: tasks.map(tasks => tasks.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/", jwtAuth, (req, res) => {
  console.log(req.body);
  const requiredFields = ["date", "time", "task", "notes"];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });
  Task.create({
    userId: req.user.id,
    date: req.body.date,
    time: req.body.time,
    task: req.body.task,
    notes: req.body.notes
  })
    .then(task => res.status(201).json(task.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.delete("/:id", jwtAuth, (req, res) => {
  Task.findByIdAndRemove(req.params.id)
    .then(expense => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = { router };
