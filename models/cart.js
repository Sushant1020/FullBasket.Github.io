
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;



const CartSchema = new Schema({
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Cart', CartSchema);
