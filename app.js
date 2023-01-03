
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
mongoose.set('strictQuery', true);


app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

const password = process.env.PASSWORD;

mongoose.connect("mongodb+srv://admin-suchismita:"+ password +"@cluster0.6u5vmz1.mongodb.net/credentialsDB", {useNewUrlParser: true});

const userSchema = {
    name: String,
    gender: String,
    mobile_number: Number,
    email: String,
    password: String
};

const User = mongoose.model("user", userSchema);
const email = [];

//Home Route
app.get("/", function(req, res){
    res.render("home");
});

//Login Page Route
app.get("/login", function(req, res){

    res.render("login", {email:[]});
});

//Sign Up Route 
app.route("/signup")


.get(function(req, res){
    res.render("sign_up",{email:[]});
})

//After registering
.post(function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
  
      if(!err){
          const user = new User({
              name: req.body.name,
              gender: req.body.genders,
              mobile_number: req.body.phone,
              email: req.body.email,
              password: hash
          });
          user.save(function(err){
              if(err){
                  console.log(err);
              }else{
                  res.redirect("/login");
              }
          });
      
      }else{
          console.log(err);
      }
      
    });
  
  
  });

//After submitting the home route form.
app.post("/welcome", function(req, res){
    email.push(req.body.email);
    User.findOne({email: req.body.email}, function(err, user){
            if(!err){
                if(user){
                    res.render("login", {email: email.slice(-1)});
                }else{
                    res.render("sign_up", {email: email.slice(-1)});
                }
            }else{
                console.log(err);
            }
        });
    });


//After submitting the login page form.
app.post("/dashboard", function(req, res){

    User.findOne({email: req.body.email}, function(err, user){
        if(!err){
            if(user){
                bcrypt.compare(req.body.password, user.password, function(err, result){
                    if(!err){
                        if(result === true){
                            res.render("dashboard");
                        }
                    }else{
                        console.log(err);
                    }
                });
            }
        }
    });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("Server started successfully.");
});
