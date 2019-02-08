"use strict";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const taskSchema = mongoose.Schema({
  date: String,
  time: String,
  task: String,
  notes: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

userSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

taskSchema.methods.serialize = function() {
  return {
    id: this._id,
    userId: this.userId,
    date: this.date,
    time: this.time,
    task: this.task,
    notes: this.notes
  };
};

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    fullName: this.fullName || "",
    username: this.username || ""
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

//const Solve = mongoose.model("Solve", solveSchema);
const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = { User, Task };
