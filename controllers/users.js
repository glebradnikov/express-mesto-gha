const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res
        .status(404)
        .send({ message: 'Пользователь по указанному _id не найден.' });
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении профиля.',
      });
      res
        .status(404)
        .send({ message: 'Пользователь с указанным _id не найден.' });
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара.',
      });
      res
        .status(404)
        .send({ message: 'Пользователь с указанным _id не найден.' });
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
