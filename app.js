// / const fdata = require('./static/home');
// const alrt = require('./signup');
const express = require('express');
const hbs=require('hbs');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const { query } = require('express');
const async = require('hbs/lib/async');
var nodemailer = require('nodemailer');
const { verify } = require('crypto');
const multer = require('multer');
var MongoClient = require('mongodb').MongoClient;


let storage = multer.diskStorage({
    destination: 'static/images/',
    filename: (req,file,cb)=>{
        cb(null,file.originalname)
    }
})

let upload = multer({
    storage: storage
})







const port = 8000;
// const box = alrt;
app.use(bodyparser.urlencoded());


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/sellerLoginData');
    console.log("connected to db");
    // data = await complaintData.complaint.find();
    //    const data = await Complaint.find()
    //     // const docs = JSON.parse(data)
    //     module.export = data;

}
const formSchema = new mongoose.Schema({
    FName: String,
    LName: String,
    EmailAdd: String,
    PhoneNo: String,
    Address: String,
    CropName: String,
    CropQ: String,
    CropP: String,
    file : String,
})
// const loginSchema = new mongoose.Schema({
//     fieldname: String,
//     originalname: String,
//     encoding: String,
//     mimetype: String,
//     destination: String,
//     filename: String,
//     path: String,
//     size: String
// });
const Sell= mongoose.model('Sell', formSchema);
// const Login = mongoose.model('Login', loginSchema);

// module.exports = Login;
module.export = Sell;

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'));// For servering static files
app.use(express.urlencoded());

// HBS SPECIFIC STUFF
app.set('view engine', 'hbs');// set the template engine as hbs
app.set('views', path.join(__dirname, 'views'));// set the view directory

// ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).render('log.hbs');
});
app.get('/sell', (req, res) => {
    res.status(200).render('seller.hbs');
});

app.get('/signup', (req, res) => {
    res.status(200).render('sign.hbs');
});
app.get('/contact', (req, res) => {
    res.status(200).render('contact.hbs');
});
app.get('/market', (req, res) => {
    var code="";
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sellerLoginData");
        dbo.collection("sells").find({}).toArray(function(err, result) {
          if (err) throw err;
        //   for(let i=0;i<result.length;i++){
        //     code=code+ ``;
        //   }
        //   console.log(element);
        console.log(result);
        
       
        dbo.collection("logins").find({}).toArray(function(err, file_loc) {
            if (err) throw err;
          //   for(let i=0;i<result.length;i++){
          //     code=code+ ``;
          //   }
          //   console.log(element);
        //   console.log(result);
          
         

        res.status(200).render('market.hbs',{result:result,file_loc:file_loc})
          db.close();
        });
        });
      });
      
    
});
app.get('/home',(req,res)=>{
    res.status(200).render('index.hbs')
});
app.post('/sell',upload.single('file'), async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    var myData = new Sell(req.body);
    myData.save().then(async ()=> {
        console.log(file);
        // console.log(document.getElementsByTagName("file"));
        const alert = true;
        res.render('seller.hbs',{alert:alert});
        // alert("The crop is added");
    }).catch(() =>{
        
        const unsaved = true;
        res.render('seller.hbs',{unsaved:unsaved});
        // alert("The Crop is not added");
    });
    
    var dta = new Login(req.file);
    dta.save().then(async()=>{}).catch(()=>{
        const xyz = true;
        res.render('seller.hbs',{xyz:xyz});
    });
});






















// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on ${port}`);
});