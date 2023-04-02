const mongoose = require("mongoose");
const Product = require("./product");
const Order = require("./order");

const userSchema = new mongoose.Schema({
  id: { type: String},
  username: { type: String},
  email: { type: String},
  password: { type: String},
  products: [Product.schema],
  orders: [Order.schema]
});

module.exports = mongoose.model('User', userSchema);