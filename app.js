const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandling = require('./middlewares/error-handling');
const { validateSignIn, validateSignUp } = require('./middlewares/validators');
const { createUser, login } = require('./controllers/users');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } =
  process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const app = express();

mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(limiter);

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use((request, response, next) => {
  next(new NotFoundError('Неправильный путь запрашиваемой страницы'));
});
app.use(errors());
app.use(errorHandling);

app.listen(PORT);
