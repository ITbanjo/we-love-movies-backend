const service = require("./reviews.service");

// const VALID_PROPERTIES = [
//     "supplier_name",
//     "supplier_address_line_1",
//     "supplier_address_line_2",
//     "supplier_city",
//     "supplier_state",
//     "supplier_zip",
//     "supplier_phone",
//     "supplier_email",
//     "supplier_notes",
//     "supplier_type_of_goods",
//   ];

//   function hasOnlyValidProperties(req, res, next) {
//     const { data = {} } = req.body;
//     const invalidFields = Object.keys(data).filter(
//       (field) => !VALID_PROPERTIES.includes(field)
//     );
//     if (invalidFields.length) {
//       return next({
//         status: 400,
//         message: `Invalid field(s): ${invalidFields.join(", ")}`,
//       });
//     }
//     next();
//   }

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

// async function update(req, res) {
//   const updatedReview = {
//     ...res.locals.review,
//     ...req.body.data,
//     review_id: res.locals.review.review_id,
//   };
//   const updateData = await service.update(updatedReview);
//   const data = {
//     ...updateData,
//     critic: await service.selectReviewCritic(updateData.critic_id),
//   };
//   res.json({ data });
// }

async function update(req, res) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    //     review_id: res.locals.review.review_id,
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
  update: [reviewExists, update],
  delete: [reviewExists, destroy],
};
