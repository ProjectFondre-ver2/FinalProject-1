const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: { type: Number},
  imgUrl: { type: String},
  name: { type: String},
  description: { type: String},
  price: { type: Number},
  amount: { type: Number, default: 1},
  status: { type: String}
});

module.exports = mongoose.model("Order", orderSchema);