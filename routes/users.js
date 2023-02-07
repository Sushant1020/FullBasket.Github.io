const users = require('../controllers/users');
const isLoggedIn = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = require('express').Router();
const passport = require('passport');

router.route('/register')
  .get((users.register))
  .post(catchAsync(users.registeruser));


router.route('/login')
  .get(users.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// router.route('/cart')
//   .get(users.rendercart);

router.route('/cart/:id')
  .get(users.cartshowadded);

router.route('/cart')
  .get(users.showusercart);

router.route('/cartremove/:id')
  .get(users.cartremove);

router.get('/logout', users.logout);

router.route('/viewprofile')
  .get(users.viewprofile);


module.exports = router;