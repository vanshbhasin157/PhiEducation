const express = require("express");
require("dotenv/config");
var bodyparser = require("body-parser");
var passport = require("passport");
const app = express();
var path = require('path')
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/public', express.static(__dirname + "/public"));
const auth = require("./routes/User");
const contactMe = require("./routes/ContactMe");
const { database } = require("./models/modelExport.js");
database.sequelize.sync();
//Passport middleware
app.use(passport.initialize());
//Config for JWT strategy
require("./strategies/jsonwtStrategy")(passport);
app.use("/api", auth);
app.use("/api",contactMe);
app.set('views', './views')
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/homePage.html')
});
app.get("/contactMe",(req,res)=>{
  res.sendFile(__dirname + '/views/contactMe.html')
});
app.get("/adminLogin",(req,res)=>{
  res.sendFile(__dirname + '/views/adminLogin.html')
});
app.get("/forgetPassword",(req,res)=>{
  res.sendFile(__dirname + '/views/forgetPassword.html')
});
app.get("/messages",(req,res)=>{
  res.sendFile(__dirname + '/views/myMessages.html')
})
app.listen(8000, () => {});