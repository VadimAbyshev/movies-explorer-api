const mongoose = require('mongoose');
const { urlRegex } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  duration: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'В поле должен быть URL изображения'],
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'URL неверный',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'В поле должна быть ссылка на Трейлер к Фильму'],
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'URL неверный',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'В поле должен быть URL изображения постера'],
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'URL неверный',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
