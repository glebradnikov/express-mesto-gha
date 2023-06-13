const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

module.exports.login = (request, response, next) => {
  const { email, password } = request.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });

      response.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      response.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (request, response, next) => {
  const { name, about, avatar, email, password } = request.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        response.status(201).send({ user });
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          next(
            new BadRequestError(
              'Переданы некорректные данные при создании пользователя'
            )
          );
          return;
        }

        if (error.name === 'MongoServerError') {
          next(
            new ConflictError(
              'При регистрации указан email, который уже существует на сервере'
            )
          );
          return;
        }

        next(error);
      });
  });
};

module.exports.getUsers = (request, response, next) => {
  User.find({})
    .then((users) => {
      response.send({ users });
    })
    .catch(next);
};

module.exports.getCurrentUser = (request, response, next) => {
  const { _id } = request.user;

  User.findOne({ _id })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      response.send({ user });
    })
    .catch(next);
};

module.exports.getUser = (request, response, next) => {
  const { userId } = request.params;

  User.findById(userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      response.send({ user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для поиска пользователя'
          )
        );
        return;
      }

      next(error);
    });
};

module.exports.updateUserInfo = (request, response, next) => {
  const { name, about } = request.body;
  const { _id } = request.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      response.send({ user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля'
          )
        );
        return;
      }

      next(error);
    });
};

module.exports.updateUserAvatar = (request, response, next) => {
  const { avatar } = request.body;
  const { _id } = request.user;

  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      response.send({ user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении аватара'
          )
        );
        return;
      }

      next(error);
    });
};
