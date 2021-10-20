const express = require("express");
const app = express();
var path = require("path");
app.use(express.static(path.join(__dirname, "/public")));
app.use("/public", express.static(__dirname + "/public"));
const jsonwt = require("jsonwebtoken");
const { database } = require("../models/modelExport");
const Op = database.Sequelize.Op;
const users = database.users;
const contactMe = database.contactMe;
app.use(express.json());
var bcrypt = require("bcrypt");
var saltRouds = 10;
var router = express.Router();
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
require("dotenv/config");
app.set("views", "./views");
app.set("view engine", "ejs");

router.post("/signUp", async (req, res) => {
  try {
    let newUser = req.body;
    await users
      .findOne({ where: { [Op.and]: [newUser.userId] } })
      .then(async (profile) => {
        if (!profile) {
          bcrypt.hash(newUser.password, saltRouds, async (err, hash) => {
            if (err) {
              console.log("Error is", err.message);
            } else {
              newUser.userId = uuidv4();
              newUser.password = hash;
              await users
                .create(newUser)
                .then(() => {
                  res.status(200).send("User Registerd");
                })
                .catch(err);
              {
                console.log(err);
              }
            }
          });
        } else {
          res.status(401).send("User already exists");
        }
      });
  } catch (err) {
    res.send({
      message: err,
    });
  }
});
router.post("/login", async (req, res) => {
  var newUser = req.body;
  try {
    const detectedUser = await users.findOne({
      where: { username: newUser.username },
    });
    const data = await contactMe.findAll({ limit: 50 });
    if (!detectedUser) {
      res.send("User does not exist");
    } else {
      bcrypt.compare(
        newUser.password,
        detectedUser.password,
        async (err, result) => {
          if (err) {
            console.log("Error is", err.message);
          } else if (result == true) {
            const payload = {
              id: detectedUser.id,
              name: detectedUser.firstName + " " + detectedUser.lastName,
              email: detectedUser.email,
            };
            jsonwt.sign(
              payload,
              process.env.SECRET_KEY,
              { expiresIn: 3600 },
              (err, token) => {
                if (data) {
                  console.log(data);
                  res.render("myMessages", {
                    fullname: detectedUser.firstName + " " + detectedUser.lastName,
                    count: Object.keys(data).length,
                    data: data,
                  });
                } else {
                  console.log("errr");
                }
              }
            );
          } else {
            res.status(401).send("Unauthorized Access");
          }
        }
      );
    }
  } catch (err) {
    console.log("Error is", err.message);
  }
});
router.post("/forgetPassword", async (req, res) => {
  const updateUser = req.body;
  await users
    .findOne({ where: { email: req.body.email } })
    .then((profile) => {
      if (!profile) {
        res.status(401).send("User Not Found");
      } else {
        bcrypt.hash(req.body.password, saltRouds, async (err, hash) => {
          if (err) {
            console.log("Error while updating password");
          } else {
            req.body.password = hash;
            await users
              .update(updateUser, { where: { email: req.body.email } })
              .then(() => {
                res.sendFile(path.resolve("views/passwordSuccess.html"));
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
