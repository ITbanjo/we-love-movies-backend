const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function selectReviewCritic(critic_id) {
  return knex("critics as c").select("*").where("critic_id", critic_id).first();
}

function read(reviewId) {
  return knex("reviews").select("*").where("review_id", reviewId).first();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where("review_id", updatedReview.review_id)
    .update(updatedReview, "*")
    .then((updateData) => updateData[0]);
}

function destroy(reviewId) {
  return knex("reviews").where("review_id", reviewId).del();
}

module.exports = {
  read,
  update,
  delete: destroy,
  selectReviewCritic,
};
