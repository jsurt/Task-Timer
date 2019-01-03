const express = require('express');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);

describe('app should return 200 status code and serve static html file', function() {

    before(function() {
        server = app.listen(process.env.PORT || 8000);
    });
    after(function() {
        server.close(() => {console.log('server is closed')});
    });

    it('should return a 200 status code and serve static html file', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
            })
    })

});