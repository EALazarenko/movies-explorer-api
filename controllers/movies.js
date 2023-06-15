const mongoose = require('mongoose');

const Movie = require('../models/movie');
const {
  HTTP_STATUS_CREATED,
} = require('../utils/codeErrors');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate([
      'owner',
    ])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const _id = req.params.movieId;

  Movie.findById({ _id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if ((movie.owner).toString() === req.user._id) {
        Movie.deleteOne(movie._id)
          .orFail()
          .then(res.send({ message: 'Фильм удален' }))
          .catch(next);
      } else {
        next(new ForbiddenError('Невозможно удалить'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный ID фильма'));
      } else {
        next(err);
      }
    });
};
