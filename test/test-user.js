"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../models");
const { JWT_SECRET, TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("POST to /users to create new user", function() {
  before(function() {
    runServer(TEST_DATABASE_URL);
  });

  after(function() {
    closeServer();
  });

  const username = "username";
  const password = "password123";
  const firstName = "Test";
  const lastName = "User";
  const fullName = "Test User";

  it("Should reject users without username", function() {
    return chai
      .request(app)
      .post("/users")
      .send({
        password,
        firstName,
        lastName
      })
      .then(variable => expect(variable).to.have.status(422))
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(422);
        expect(res.body.reason).to.equal("ValidationError");
        expect(res.body.message).to.equal("Missing field");
        expect(res.body.location).to.equal("username");
      });
  });

  it("Should create a new user", function() {
    return chai
      .request(app)
      .post("/users")
      .send({
        username,
        password,
        firstName,
        lastName
      })
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.keys("fullName", "id", "username");
        expect(res.body.fullName).to.equal(fullName);
        expect(res.body.username).to.equal(username);
        return User.findOne({
          username
        });
      })
      .then(user => {
        expect(user).to.not.be.null;
        expect(user.firstName).to.equal(firstName);
        expect(user.lastName).to.equal(lastName);
        return user.validatePassword(password);
      })
      .then(passwordIsCorrect => {
        expect(passwordIsCorrect).to.be.true;
      });
  });
});
