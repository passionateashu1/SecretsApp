//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");

const app = express();

//console.log(process.env.API_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(function(req, res){
    User.findOne(
      {
        email: req.body.username
      },
      function(err, foundUser){
        if (foundUser) {
          if (foundUser.password === req.body.password) {
            res.render("secrets");
          } else {
            console.log("User password is not matching.");
          }
        } else {
          console.log("User not registered.");
        }
      }
    );
  });

app.route("/register")
  .get(function(req, res){
    res.render("register");
  })
  .post(function(req, res){
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });

    newUser.save(function(err){
      if (!err) {
        //console.log("User registered successfully.");
        res.render("secrets");
      } else {
        console.log(err);
      }
    });

    //res.redirect("submit");
  });

app.listen(3000, function(){
  console.log("Server running on port 3000.");
});
