
const mongoose = require('mongoose');
const mobiles = require('./mobile');
const { name, price } = require('./seedHelpers');
const Product = require('../models/products');
const mobile = require('./mobile');

mongoose.connect('mongodb://127.0.0.1:27017/FullBasket', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
  await Product.deleteMany({});
  const random6 = Math.floor(Math.random() * 30);
  for (let i = 0; i < 30; i++) {
    const product = new Product({
      name: `${sample(name)}`,
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus aspernatur fugiat impedit libero, culpa dolorem magnam accusantium nostrum facilis. Perspiciatis assumenda, provident harum blanditiis dolores eos doloribus quos nisi ipsam.',
      price: `${sample(price)}`,
      images: [{
        url: "https://res.cloudinary.com/djognfxr9/image/upload/v1674814214/71293gyogZL._AC_UY327_QL65__w5cudw.jpg",
        filename: "FULLBASKET/mobileimages"
      }]

    });
    await product.save();
  }

}

seedDB().then(() => {
  mongoose.connection.close();
});