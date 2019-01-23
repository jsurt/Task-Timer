'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
const passport = require('passport');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Solve, User } = require('./models');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

app.use(express.json());
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
    res.status(200);
});

app.get('/dev', (req, res) => {
  res.sendFile(__dirname + '/public/timer.html');
})

app.get('/solves', (req, res) => {
    
    Solve
        .find()
        .then(solves => {
            res.json({
              solves: solves.map(
                (solves) => solves.serialize())
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
    res.status(200);
});

app.get('/solves/:id', (req, res) => {
    Solve 
        .findById(req.params.id)
        .then(solve => res.json(solve.serialize()))
        .catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
        });
});

app.post('/users/:id/solves', (req, res) => {
  
  const requiredFields = ['time', 'notes', 'scrambleAlg', 'date'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });

  User
    .findById(req.params.id)
    .then(user => {
      if (user) {
        Solve
          .create({
            solverId: req.params.id,
            time: req.body.time,
            notes: req.body.notes,
            scrambleAlg: req.body.scrambleAlg,
            date: req.body.date
          })
          .then(solve => res.status(201).json({
            time: solve.time,
            notes: solve.notes
          }))
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
          });
      }
      else {
        const message = `User not found`;
        console.error(message);
        return res.status(400).send(message);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

app.put('/solves/:id', (req, res) => {
    if (req.body.id !== req.params.id) {
      const msg = 'Request id in body must match with id in params';
      console.error(msg);
      res.status(400).send(msg);
    }
    let toUpdate = {};
    const updateableFields = ['notes'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    Solve.findByIdAndUpdate(req.params.id, { $set: toUpdate })
      .then(solve => {
        res.status(204).end()
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

app.delete('/solves/:id', (req, res) => {
    Solve.findByIdAndRemove(req.params.id)
      .then(solve => {
        res.status(204).end();
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

app.delete('/users/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(solve => {
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.get('/users/:id', (req, res) => {
    User.findById(req.params.id) 
      .then(user => {
        res.status(200).json(user);
        res.sendFile(__dirname + '/public/timer.html');
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

app.get('/users/:id/solves', (req, res) => {
  Solve.find({solverId: req.params.id}) 
    .then(solves => {
      res.status(200).json(solves);
      res.sendFile(__dirname + '/public/solves.html');
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.get('/solves/:id', (req, res) => {
  Solve.findById(req.params.id) 
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//Create user
app.post('/users', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'userName', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const msg = `Missing ${field} field in request body`;
        console.error(msg);
        res.status(400).send(msg);
      }
    };
    User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      password: req.body.password
    })
      .then(user => {
        res.status(200).json(user.serialize())
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error occurred'});
      })
});

app.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.json({
        user: users.map(
          (users) => users.serialize())
      })
    })
})

let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    }, {useNewUrlParser: true});
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