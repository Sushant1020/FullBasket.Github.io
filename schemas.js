const joi = require('joi');
module.exports.productSchema = joi.object({
  product: joi.object({
    name: joi.string().required(),
    price: joi.number().required().min(0),
    // image: joi.string().required(),
    description: joi.string().required(),
    category: joi.string().required()
  }).required(),
  deleteImages: joi.array()

});

module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().min(1).max(5),
    body: joi.string().required()
  }).required()
})