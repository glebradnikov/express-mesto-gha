const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCards = (request, response, next) => {
  Card.find({})
    .then((cards) => {
      response.send({ cards });
    })
    .catch(next);
};

module.exports.createCard = (request, response, next) => {
  const { name, link } = request.body;
  const { _id } = request.user;

  Card.create({ name, link, owner: _id })
    .then((card) => {
      response.status(201).send({ card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки'
          )
        );
        return;
      }

      next(error);
    });
};

module.exports.deleteCard = (request, response, next) => {
  const { cardId } = request.params;
  const { _id } = request.user;

  Card.findById(cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (card.owner.valueOf() !== _id) {
        next(new ForbiddenError('Попытка удалить чужую карточку'));
        return;
      }

      Card.findByIdAndRemove(card._id.valueOf())
        .then(() => {
          response.send({ card });
        })
        .catch(next);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для удаления карточки'
          )
        );
        return;
      }

      next(error);
    });
};

module.exports.likeCard = (request, response, next) => {
  const { cardId } = request.params;
  const { _id } = request.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      response.send({ card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки/снятии лайка'
          )
        );
        return;
      }

      next(error);
    });
};

module.exports.dislikeCard = (request, response, next) => {
  const { cardId } = request.params;
  const { _id } = request.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      response.send({ card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки/снятии лайка'
          )
        );
        return;
      }

      next(error);
    });
};
