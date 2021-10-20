const express = require("express");
const app = express();
var path = require('path')
app.use(express.static(path.join(__dirname, '/public')));
app.use('/public', express.static(__dirname + "/public"));
var router = express.Router();
const { database } = require("../models/modelExport");
const contactMe = database.contactMe
const Op = database.Sequelize.Op;
app.use(express.json());
router.post('/contactMe',async(req,res)=>{
    try {
        const details = req.body
        if(details){
            await contactMe.create(details).then(()=>{
                res.sendFile(path.resolve('views/success.html'));
            });
        }
    } catch (error) {
        console.log(error);
        res.send('Something went wrong')
    }
});

router.get('/contactMe',async(req,res)=>{
    const data = await contactMe.findAll({limit:50});
    if(data){
        res.json(data);
    }else{
        console.log("errr");
    }
});
router.get('/:id/contactMe',async(req,res)=>{
    const data = await contactMe.findOne({where:{[Op.and]:[req.params]}})
    if(data){
        res.json(data);
    }else{
        console.log("err");
    }
});
module.exports = router