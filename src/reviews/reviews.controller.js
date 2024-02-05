const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = ["score", "content"];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function update(req, res) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
  };
  const updateData = await service.update(updatedReview);
  const data = await service.selectReviewCritic(res.locals.review.review_id);

  res.json({ data });
}

async function destroy(req, res) {
  const { reviewId } = req.params;
  await service.delete(reviewId);
  res.sendStatus(204);
}

module.exports = {
  update: [
    asyncErrorBoundary(reviewExists),
    hasOnlyValidProperties,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
