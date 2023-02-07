const joi = require('joi');
const User = require('../models/users');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { string } = require('joi');
const mapBoxToken = "pk.eyJ1Ijoic3VzaGFudDEwMjAiLCJhIjoiY2xkNnp4dzZ3MHE3MzNwbW1kZGVlN2tleiJ9._8juaHcy6NnMoThOd67HNw";
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
})



const ProductSchema = new Schema({
  name: String,
  price: String,
  description: String,
  category: String,
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

module.exports = mongoose.model('Product', ProductSchema);