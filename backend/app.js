const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
var bodyparser = require("body-parser");
var passport = require("passport");
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
const auth = require("./routes/User");
//Passport middleware
app.use(passport.initialize());
//Config for JWT strategy
require("./strategies/jsonwtStrategy")(passport);
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use("/api", auth);
app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
      emailAddress: req.user.emailAddress,
    });
  }
);


app.get("/", (req, res) => {
  res.send("ok server is running");
});

app.listen(5000, () => {});