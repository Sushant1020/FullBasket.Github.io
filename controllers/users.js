const User = require("../models/users");
const cart = require("../models/cart");
const Product = require("../models/products");
const catchAsync = require("../utils/catchAsync");
const express = require("express");
const { MongoBulkWriteError } = require("mongodb");
const { findById } = require("../models/users");
const session = require("express-session");
const { isLoggedIn, uid } = require("../middleware");
const ExpressError = require("../utils/ExpressError");

module.exports.register =
  ("/register",
  catchAsync(async (req, res) => {
    res.render("users/register");
  }));

module.exports.registeruser = async (req, res, next) => {
  try {
    const { email, username, password, phonenumber } = req.body;
    const user = new User({ email, username, phonenumber });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      console.log(err);
      req.session.user_id = registeredUser._id;
      req.flash("success", "Welcome to FullBasket");
      res.redirect("/products");
    });
  } catch (e) {
    console.log(e);
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin =
  ("/login",
  catchAsync(async (req, res) => {
    res.render("users/login");
  }));

module.exports.login = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.save();
  req.session.user_id = req.user._id;
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/products";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {});
  req.flash("success", "Goodbye");
  res.redirect("/products");
};

module.exports.cartshowadded = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const user = await User.findById(req.user._id);
  user.cart.push(product);
  await user.save();
  parr = [];
  for (prod of user.cart) {
    const product = await Product.findById(prod);
    parr.push(product);
  }
  res.redirect(`/products/show/${req.params.id}`);
});

module.exports.showusercart = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  parr = [];
  for (prod of user.cart) {
    const product = await Product.findById(prod);
    parr.push(product);
  }

  res.render("users/cart", { parr });
});

module.exports.viewprofile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  res.render("users/viewprofile", { user });
});

module.exports.cartremove = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const prd = await Product.findById(req.params.id);
  let count = 0;
  for (arr of user.cart) {
    if (arr._id === prd._id) {
      count++;
    }
  }
  user.cart.splice(count, 1);
  user.save();

  res.redirect("/cart");
});
