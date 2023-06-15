const mongoose = require('mongoose');

const { URL_REGEXP } = require('../utils/constants');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
    },
    director: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
    },
    duration: {
      type: Number,
      required: [true, 'Не заполнено обязательное поле'],
    },
    year: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
    },
    description: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
    },
    image: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
      validate: {
        validator: (url) => URL_REGEXP.test(url),
        message: 'Некорректная ссылка',
      },
    },
    trailerLink: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
      validate: {
        validator: (url) => URL_REGEXP.test(url),
        message: 'Некорректная ссылка',
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
      validate: {
        validator: (url) => URL_REGEXP.test(url),
        message: 'Некорректная ссылка',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    movieId: {
      type: Number,
      required: true,
      unique: false,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } },
);

module.exports = mongoose.model('movie', movieSchema);
