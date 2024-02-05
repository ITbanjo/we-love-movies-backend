const knex = require("../db/connection");
//const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  mCreatedAt: ["movies", null, "created_at"],
  mUpdatedAt: ["movies", null, "updated_at"],
  is_showing: ["movies", null, "is_showing"],
  mtTheaterId: ["movies", null, "theater_id"],
});

function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select(
      "t.*",
      "m.movie_id",
      "title",
      "runtime_in_minutes",
      "rating",
      "description",
      "image_url",
      "m.created_at as mCreatedAt",
      "m.updated_at as mUpdatedAt",
      "is_showing",
      "mt.theater_id as mtTheaterId"
    )
    .then(reduceMovies);
}

module.exports = {
  list,
};
