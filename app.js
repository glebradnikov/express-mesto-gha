const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandling = require('./middlewares/error-handling');
const { createUser, login } = require('./controllers/users');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
const urlRegex = /https?:\/\/(www\.)?[a-zA-Z0-9-.]+[\w\-.~:/?#[\]@!$'()*+,;=]+/;

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex),
  }),
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(cookieParser());

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use(errorHandling);

app.listen(PORT);
