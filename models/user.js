const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина - два символа'],
      maxlength: [30, 'Максиимальная длина - тридцать символов'],
      required: [true, 'Не заполнено обязательное поле'],
    },
    email: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Не заполнено обязательное поле'],
      select: false,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные логин или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
