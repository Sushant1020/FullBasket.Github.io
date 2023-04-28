const Product = require("../models/products");
const User = require("../models/users");
const Review = require("../models/reviews");
const catchAsync = require("../utils/catchAsync");
const express = require("express");
const session = require("express-session");
const { findById } = require("../models/reviews");

module.exports.home =
  ("/products",
  catchAsync(async (req, res) => {
    const product = await Product.find({});
    const prod = []; //for mobile
    const prodc = []; //for clothes
    const prodf = []; //for food
    const prodel = []; //for electronics
    const prodt = []; //for tv
    for (prode of product) {
      if (prode.category === "mobile") prod.push(prode);

      if (prode.category === "clothes") prodc.push(prode);

      if (prode.category === "food") prodf.push(prode);

      if (prode.category === "electronics") prodel.push(prode);

      if (prode.category === "tv") prodt.push(prode);
    }

    function rand() {
      const randnum = Math.floor(Math.random() * 10) + 10;
      return randnum;
    }
    res.render("products/home", {
      product,
      rand,
      prod,
      prodc,
      prodf,
      prodel,
      prodt,
    });
  }));

module.exports.allitems = catchAsync(async (req, res) => {
  const product = await Product.find({});

  res.render("products/index", { product });
});

module.exports.showproducts = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    req.flash("error", "Cannot Find That Product!");
    return res.redirect("/products");
  }

  res.render("products/show", { product });
};

module.exports.newproduct = async (req, res) => {
  res.render("products/new");
};

module.exports.addproduct = async (req, res, next) => {
  const product = new Product(req.body.product);
  console.log(product);
  product.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  product.author = req.user._id;
  await product.save();
  console.log(product);
  req.flash("success", "Successfully added new product!");
  res.redirect(`/products/show/${product._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const { id } = req.params;
  product.author = req.user._id;
  const author = product.author;
  if (!product) {
    req.flash("error", "Cannot Find That Product!");
    return res.redirect("/products");
  }
  res.render("products/edit", { product, author });
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  product.images.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await product.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(product);
  }
  await product.save();
  req.flash("success", "Successfully Updated product");
  res.redirect(`/products/show/${product._id}`);
};

module.exports.showtv = async (req, res) => {
  const product = await Product.find({});
  if (!product) {
    req.flash("error", "Cannot Find That Product!");
    return res.redirect("/products");
  }

  res.render("products/tv", { product });
};

module.exports.showfood = async (req, res) => {
  const product = await Product.find({});
  if (!product) {
    req.flash("error", "Cannot Find That Product!");
    return res.redirect("/products");
  }

  res.render("products/food", { product });
};

module.exports.showclothes = async (req, res) => {
  const product = await Product.find({});
  if (!product) {
    req.flash("error", "Cannot Find That Product!");
    return res.redirect("/products");
  }

  res.render("products/clothes", { product });
};

module.exports.showelectronics = async (req, res) => {
  const product = await Product.find({});
  if (!product) {
    req.flash("error", "Cannot Find That Product!");
    return res.redirect("/products");
  }

  res.render("products/electronics", { product });
};

module.exports.showfurniture = async (req, res) => {
  const product = await Product.find({});
  if (!product) {
    req.flash("error", "Cannot Find That Product!");
    return res.redirect("/products");
  }
  res.render("products/furniture", { product });
};

module.exports.searchresult =
  ("/search",
  async (req, res) => {
    const params = req.params;
    arr = [];
    const product = await Product.findById({});
    for (prod of product) {
      if (prod.name.equals(params)) {
        arr.push(prod);
      }
      res.render("products/search", { arr });
    }
  });

module.exports.inputreviews = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const review = new Review(req.body.review);
  product.reviews.push(review);
  const uid = req.user._id;
  const user = await User.findById(uid);
  review.author = user;
  await review.save();
  await product.save();
  req.flash("success", "Created a New Review");
  res.redirect(`/products/show/${product._id}`, { user });
};

module.exports.showmobile = async (req, res) => {
  const product = await Product.find({});
  if (!product) {
    req.flash("error", "Cannot Find That Product!");
    return res.redirect("/products");
  }

  res.render("products/mobile", { product });
};
