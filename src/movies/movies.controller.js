const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res) {
  const movies = await service.list();
  const showingMovies = movies.filter((movie) => movie.is_showing);
  if (req.query.is_showing) {
    res.json({ data: showingMovies });
  } else {
    res.json({ data: movies });
  }
}

function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function getTheatersByMovie(req, res) {
  res.json({ data: await service.getTheatersByMovie(req.params.movieId) });
}

async function getReviewsByMovie(req, res) {
  res.json({ data: await service.getReviewsByMovie(req.params.movieId) });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  getTheatersByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(getTheatersByMovie),
  ],
  getReviewsByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(getReviewsByMovie),
  ],
};
