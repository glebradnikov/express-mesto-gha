const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки.',
      });
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(400).send({ message: 'Карточка с указанным _id не найдена.' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка.',
      });
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка.',
      });
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
