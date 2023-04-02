const express = require("express");
const app = express(); // express function​
const axios = require("axios");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connection
db.connect();

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000, function () {

console.log("server listening on port 3000");

})