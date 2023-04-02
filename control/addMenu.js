const User = require("../model/user");
const Product = require("../model/product");

const addToWishlist = async (username, productId) => {
  try {
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error(`User ${username} not found`);
    }

    // Find the product
    const product = await Product.findOne({ id: productId });
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    // Check if the product is already in the wishlist
    if (user.wishlist.products.includes(product._id)) {
      console.log(`Product ${productId} already in the wishlist of user ${username}`);
      return;
    }

    // Push the product into the user's wishlist and save the user
    user.wishlist.products.push(product._id);
    await user.save();

    console.log(`Added product ${productId} to the wishlist of user ${username}`);
  } catch (error) {
    console.error(error);
    throw new Error('Error adding product to wishlist');
  }
};

module.exports = { addToWishlist };
