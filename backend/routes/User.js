const express = require("express");
const app = express();
const jsonwt = require("jsonwebtoken");
const { database } = require("../models/modelExport");
const Op = database.Sequelize.Op;
const users = database.users
app.use(express.json());
var bcrypt = require("bcrypt");
var saltRouds = 10;
var router = express.Router();
require("dotenv/config");

router.post("/signUp", async (req, res) => {
  try {
    const newUser = req.body
    await users.findOne({ where:{[Op.and]:[newUser.userId]} }).then(
      async (profile) => {
        if (!profile) {
          bcrypt.hash(newUser.password, saltRouds, async (err, hash) => {
            if (err) {
              console.log("Error is", err.message);
            } else {
              newUser.password = hash;
              await users.create(newUser)
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
      }
    );
  } catch (err) {
    res.send({
      message: err,
    });
  }
});
router.post("/login", async (req, res) => {
  var newUser = req.body
  await users.findOne({ where:{[Op.and]:[newUser.userId]} })
    .then((profile) => {
      if (!profile) {
        res.send("User does not exist");
      } else {
        bcrypt.compare(
          newUser.password,
          profile.password,
          async (err, result) => {
            if (err) {
              console.log("Error is", err.message);
            } else if (result == true) {
              
              const payload = {
                id: profile.id,
                name: profile.firstName + " " + profile.lastName,
                emailAddress: profile.emailAddress,
              };
              jsonwt.sign(
                payload,
                process.env.SECRET_KEY, 
                { expiresIn: 3600 },
                (err, token) => {
                  res.status(200).json({
                    payload:payload,
                    success: true,
                    token: token,
                  });
                }
              );
            } else {
              res.status(401).send("Unauthorized Access");
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log("Error is", err.message);
    });
});
module.exports = router;