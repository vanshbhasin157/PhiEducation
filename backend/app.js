const express = require("express");
require("dotenv/config");
var bodyparser = require("body-parser");
var passport = require("passport");
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
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
app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      email: req.user.email,
      name: req.user.firstName + " " +req.user.lastName,
      username: req.user.username,
    });
  }
);



app.get("/", (req, res) => {
  res.send("ok server is running");
});

app.listen(5000, () => {});