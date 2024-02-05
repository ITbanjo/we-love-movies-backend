const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCriticDetails = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  cCriticId: "critic.critic_id",
  cCreatedAt: "critic.created_at",
  cUpdatedAt: "critic.updated_at",
});

function selectReviewCritic(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.*",
      "c.critic_id as cCriticId",
      "preferred_name",
      "surname",
      "organization_name",
      "c.created_at as cCreatedAt",
      "c.updated_at as cUpdatedAt"
    )
    .where({ review_id: reviewId })
    .first()
    .then((result) => {
      const updatedReview = addCriticDetails(result);
      return updatedReview;
    });
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
