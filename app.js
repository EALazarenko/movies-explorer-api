require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { PORT, BASE_PATH, MONGODB_URI } = require('./config');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const errorHandler = require('./middlewares/err');
const { limiter } = require('./utils/rateLimiter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(helmet());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
})
  .then(() => console.log('база подключена'))
  .catch((err) => console.log(err));

const corsOptions = {
  origin: [/* 'http://mesto.lazarenkoea.nomoredomains.monster', */
    'https://api.movie.lazarenkoea.nomoredomains.rocks',
    'http://api.movie.lazarenkoea.nomoredomains.rocks',
    /* 'https://mesto.lazarenkoea.nomoredomains.monster', */
    'http://localhost:3000',
    'https://localhost:3000'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(requestLogger);

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Ссылка на сервер:', `${BASE_PATH}:${PORT}`);
});
