const Product = require('./models/products');
const { productSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');


module.exports.isLoggedIn = (req, res, next) => {

  if (!req.isAuthenticated()) {
    const redirectUrl = req.session.returnTo || "/login";
    req.flash('error', "you must be signed in");
    res.redirect(redirectUrl);

  }
  next();
}

module.exports.validateProduct = (req, res, next) => {

  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that');
    res.redirect(`/products/home`);
  }
  next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that');
    res.redirect(`/campgrounds/${id}`);
  }
  next();
}


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }

}
