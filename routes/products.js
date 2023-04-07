const product = require("../controllers/product");
const ExpressError = require("../utils/ExpressError");
const express = require("express");
const router = require("express").Router();
const { isLoggedIn, isAuthor, validateProduct } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/").get(product.home);

router
  .route("/index")
  .get(isLoggedIn, product.allitems)
  .post(upload.array("image"), catchAsync(product.addproduct));

router.route("/show/:id").get(product.showproducts);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateProduct,
    catchAsync(product.updateProduct)
  );

router.route("/:id/edit").get(isLoggedIn, isAuthor, product.renderEditForm);

router.route("/new").get(isLoggedIn, product.newproduct);

router.route("/tv").get(product.showtv);

router.route("/food").get(product.showfood);

router.route("/clothes").get(product.showclothes);

router.route("/electronics").get(product.showelectronics);

router.route("/furniture").get(product.showfurniture);

router.route("/mobile").get(product.showmobile);

router.route("/search").get(product.searchresult);

router.route("/:id/reviews").post(product.inputreviews);

module.exports = router;
