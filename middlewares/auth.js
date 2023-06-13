const jsonwebtoken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (request, response, next) => {
  const { jwt } = request.cookies;

  if (!jwt) {
    throw new UnauthorizedError('Передан неверный JWT');
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, 'some-secret-key');
  } catch (error) {
    throw new UnauthorizedError('Передан неверный JWT');
  }

  request.user = payload;

  next();
};
