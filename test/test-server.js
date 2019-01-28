const express = require("express");
const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const expect = chai.expect;

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");

chai.use(chaiHttp);

describe("app should return 200 status code and serve static html file", function() {
  before(function() {
    runServer(TEST_DATABASE_URL);
  });
  after(function() {
    closeServer();
  });

  it("on get to root, should return 'login/signup' page", function() {
    return chai
      .request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("on get to root, should return 'timer' page", function() {
    return chai
      .request(app)
      .get("/timer")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });

  it("on get to root, should return 'solves' page", function() {
    return chai
      .request(app)
      .get("/solves")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});
