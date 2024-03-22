const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');

const NotFoundError = require('../errors/NotFoundError');
const { signin, signup } = require('../middlewares/validations');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', signin, login);
router.post('/signup', signup, createUser);

router
  .use('/users', auth, userRoutes)
  .use('/movies', auth, movieRoutes)
  .use('*', auth, (req, res, next) => {
    next(new NotFoundError('Страница не найдена'));
  });

module.exports = router;
