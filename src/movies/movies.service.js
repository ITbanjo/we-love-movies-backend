const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCategory = mapProperties({
  id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  critic_created: "critic.created_at",
  critic_updated: "critic.updated_at",
});

function list() {
  return knex("movies as m")
    .distinct()
    .select(
      "m.movie_id as id",
      "title",
      "runtime_in_minutes",
      "rating",
      "description",
      "image_url",
      "is_showing"
    )
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id");
}

function read(movieId) {
  return knex("movies").select("*").where("movie_id", movieId).first();
}

function getTheatersByMovie(movieId) {
  return knex("theaters as t")
    .distinct()
    .select("t.*", "is_showing", "movie_id")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .where("movie_id", movieId)
    .where("is_showing", true);
}

function getReviewsByMovie(movieId) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .distinct()
    .select(
      "r.*",
      "c.critic_id as id",
      "preferred_name",
      "surname",
      "organization_name",
      "c.created_at as critic_created",
      "c.updated_at as critic_updated"
    )
    .where("movie_id", movieId)
    .then((critics) => {
      return critics.map((critic) => {
        return addCategory(critic);
      });
    });
}

module.exports = {
  list,
  read,
  getTheatersByMovie,
  getReviewsByMovie,
};
