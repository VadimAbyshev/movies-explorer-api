const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const { SECRET_KEY = 'sobaka' } = process.env;

module.exports.addUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))

    .then((user) => res.status(201).send({
      name: user.name, _id: user._id, email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getMeUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.editUserData = (req, res, next) => {
  const { name, email } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: true })
      .orFail()
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError(`Пользователь с email: ${email} уже зарегистрирован`));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError(`Пользователь по указанному _id: ${req.user._id} не найден.`));
        } else {
          next(err);
        }
      });
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
