/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connection = require('./database');
const { response } = require('express');

const { SERVER_PORT, CLIENT_URL, JWT_AUTH_SECRET } = process.env;

const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ errorMessage: 'Please specify both email and password' });
  } else {
    console.log(password);
    const hash = bcrypt.hashSync(password, 10);
    console.log(hash);

    connection.query(
      `INSERT INTO user(email, password) VALUES (?, ?)`,
      [email, hash],
      (error, result) => {
        if (error) {
          res.status(500).json({ errorMessage: error.message });
        } else {
          res.status(201).json({
            id: result.insertId,
            email,
            password: 'hidden',
          });
        }
      }
    );
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ errorMessage: 'Please specify both email and password' });
  } else {
    connection.query(
      `SELECT * FROM user WHERE email=?`,
      [email],
      (error, result) => {
        if (error) {
          res.status(500).json({ errorMessage: error.message });
        }

        // if the user does not exist throw back invalid email
        else if (result.length === 0) {
          res.status(403).json({ errorMessage: 'Invalid email' });
        }
        // if there is a user with that email, check the password
        else if (bcrypt.compareSync(password, result[0].password)) {
          // Passwords match
          const user = {
            id: result[0].id,
            email,
            password: 'hidden',
          };
          const token = jwt.sign({ id: user.id }, JWT_AUTH_SECRET);
          res.status(200).json({ user, token });
        } else {
          // Passwords don't match
          res.status(403).json({ errorMessage: 'Invalid password' });
        }
      }
    );
  }
});

// Token middleware
const authenticateWithJsonWebToken = (req, res, next) => {
  if (req.headers.authorization !== undefined) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, JWT_AUTH_SECRET, (err, decoded) => {
      if (err) {
        res
          .status(401)
          .json({ errorMessage: "you're not allowed to access these data" });
      } else {
        req.user_id = decoded.id;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ errorMessage: "you're not allowed to access these data" });
  }
};

app.get('/verify-token', authenticateWithJsonWebToken, (req, res) => {
  const user_id = req.user_id;
  connection.query(
    'SELECT * FROM user WHERE user.id = ?',
    [user_id],
    (err, results) => {
      if (err) res.status(500).send(err);
      else res.status(200).send({ ...results[0], password: 'hidden' });
    }
  );
});

// public endpoint example
app.get('/welcome', (req, res) => {
  res.status(200).json({ message: 'welcome to the app' });
});

// private endpoint example
app.get('/users', authenticateWithJsonWebToken, (req, res) => {
  connection.query(`SELECT * FROM user`, (error, result) => {
    if (error) {
      res.status(500).json({ errorMessage: error.message });
    } else {
      res.status(200).json(
        result.map((user) => {
          return { ...user, password: 'hidden' };
        })
      );
    }
  });
});

// Don't write anything below this line!
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}.`);
});
