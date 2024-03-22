const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { createMovieValidation, movieByIdValidation } = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:movieId', movieByIdValidation, deleteMovie);

module.exports = router;
