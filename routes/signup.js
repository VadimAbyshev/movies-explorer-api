const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { emailRegex } = require('../utils/constants');
const { addUser } = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().min(2).max(30).required(),
  }),
}), addUser);

module.exports = router;
