const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/unauthorized-error');

const regex = /https?:\/\/(www\.)?[a-zA-Z0-9-.]+[\w\-.~:/?#[\]@!$'()*+,;=]+/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: regex,
        message: 'Некорректный URL',
      },
    },
    email: {
      type: String,
      unique: [true, 'Поле "email" должно быть уникальным'],
      required: [true, 'Поле "email" должно быть заполнено'],
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
      validate: {
        validator: (password) => validator.isStrongPassword(password),
        message: 'Некорректный password',
      },
    },
  },
  {
    versionKey: false,
  }
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль')
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль')
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
