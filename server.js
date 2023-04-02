const express = require("express");
const app = express(); // express function​
const axios = require("axios");
const bodyParser = require("body-parser");
const db = require("./config/db");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connection
db.connect();

const mapAPI = "G2()fRXHBIXg0emsJ75J4gCfjiOE6XA71L)rd93HCGM)9cBLZh(lKISRGn)OyYl1aIbkNQ8JD80fL)dusyeKZD0=====2";

//Schema models
const User = require("./model/user");
const Product = require("./model/product");
const addMenu = require("./control/addMenu");

// Authentication
const MongoStore = require('connect-mongo');
const session = require('express-session');
const Authen = require("./control/authen");



// Define generating of session
app.use(session({
    secret: 'qei0has4325weq1qqqweazxqw', // Never ever share this secret
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, //one hour
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/mydatabase'
    })
}));

// set the view engine to ejs​
app.set('views', './views');
app.set('view engine', 'ejs');

//serve static files in public
app.use(express.static("public"));

const img02 = ["./images/truffle02.jpg", "./images/chateaubriand02.jpg", "./images/foiegras02.jpg"];


app.get('/', async (req, res) => {
    let user = null;
    
    if (req.session.userId) {
      user = await User.findById(req.session.userId).exec();
    }
  
    const products = await Product.find({}).exec();
  
    res.render('index', { user, products, img02 });
  });

  app.get('/addproduct/:id/:productId', async (req, res) => {
    const { id, productId } = req.params;

    try {
        // Find the user's wishlist and populate it with products
        const user = await User.findOne({ id });
        const product = await Product.findOne({id: productId});
        user.products.push(product);
        console.log(product)
        user.save();

        console.log(`Added product ${productId} to the wishlist of user ${id}`);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error adding product ${productId} to ${id}'s wishlist.`);
    }
});
  
app.post('/delete/:id/:productId', async (req, res) => {
  const { id, productId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findOne({ id });

    // Remove the product with the specified ID from the user's products array
    user.products.pull({ _id: productId });
    await user.save();

    res.redirect('/order/'+id);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error removing product with ID ${productId}`);
  }
});

app.post('/confirm/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ id });
  if (user.products.length === 0) {
    res.send('No products.');
    return;
  }
  // Convert user's products into orders
  const orders = user.products.map((product) => ({
    name: product.name,
    price: product.price,
    imgUrl: product.imgUrl,
    amount: product.amount
  }));

  // Add orders to user's order history
  user.orders.push(...orders);
  user.products = [];

  await user.save();

  res.redirect('/order/'+id);
});

app.get('/login', (req,res)=>{ 
    res.render('login');
})

app.get('/map', (req,res)=> {
    res.render('map');
})

app.get('/order/:id', async (req,res)=> {
    if (!req.session.userId) {
        // User not logged in, redirect to login page
        res.redirect('/login');
        return;
      }
      const userId = req.session.userId;
      const user = await User.findById(userId);
      const userlist = user.wishlist;
      try {
        res.render('order', {user}); // Render the EJS view and pass the wishlist data as an object
      } catch (err) {
        console.log(err);
      }
})



app.get('/restaurant', async (req,res)=> {
  if (req.session.userId) {
    user = await User.findById(req.session.userId).exec();
  } else {
    res.redirect('/login');
  }
    res.render('restaurant');
})

app.post('/loginsubmit', async (req,res) => {

    const inEmail = req.body.Email
    const inPassword = req.body.Password
  // Find the user in the database
  const user = await User.findOne({ email: inEmail });
  console.log(user);
  console.log(inPassword);
  console.log(inEmail);
  if (!user) {
    // User not found
    res.status(401).send('Invalid email or password');
    return;
  }

  // Check if the password is correct
  if (inPassword !== user.password) {
    // Incorrect password
    res.status(401).send('Invalid email or password');
    return;
  }

  // Store the user ID in the session cookie
  req.session.userId = user._id;

  // Redirect the user to the dashboard page
  res.redirect('/');
})

app.post('/register', async (req, res) => {
    try {
      const { RegUsername, RegEmail, RegPassword } = req.body;
      const userID = Math.floor(Math.random()*9999)+1000;
  
      // Check if user with the same email already exists in the database
      const existingUser = await User.findOne({ email: RegEmail });
      if (existingUser) {
        return res.send('Email already registered');
      }
  
      // Create a new user in the database
      const newUser = new User({ id:userID, username: RegUsername, email: RegEmail, password: RegPassword});
      await newUser.save();
  
      // Redirect the user to the login page
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.send('Error registering user');
    }
  });
  
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
  });
  




app.listen(3000, function () {

console.log("server listening on port 3000");

})