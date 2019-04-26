const express = require('express');
const app = express();
const mysql = require('mysql'); 
const bodyParser = require('body-parser');
const url =require('url');
const querystring = require('querystring');
const path = require('path');

var output = {};

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

 app.use(express.static('./dist/postal-api'));
 
 app.get('/', (req,res)=>{
     if(err) return  console.log(err);
    res.sendFile(path.resolve('./dist/postal-api/index.html'));
 })
app.use(bodyParser.urlencoded({extended: false}));
const convar = mysql.createPool({
    host : "remotemysql.com",
    user : "w1BbzgPf2x",
    password : "9g8MLdMXcW",
    database : "w1BbzgPf2x"
});
app.get('/api/pincode/:id', (req, res) => {
    var pin = req.params.id;
    var result =[];
    const bool = pin.match(/^[1-9][0-9]{5}$/);
    // res.send(bool);
    if(!bool) return res.status(400).json({
            message: "Pincode is invalid",
            Status : "error",
            postoffice:[]
    });

    convar.getConnection((err) => {
        if (err) throw err;
        console.log("Connected to the database");
        const sql =   `SELECT officename, pincode, Deliverystatus, Taluk, Districtname, statename, Telephone FROM mytable WHERE pincode=${parseInt(pin)}`;
        convar.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
           
            output={
                message:   `Number of post offices found ${result.length}`,
                status: "ok",
                postoffice:result
            };
             res.jsonp(output);
        });
    });

    
});


app.get('/api/polist/', (req, res)=> {
     let state1 = req.query.state;
        if (state1) { var state = state1.replace(/_/g, " "); }
   else {     state = state1; }
        let district1 = req.query.district;
 if (district1)  {
 var district = district1.replace(/_/g, " "); 
} else{
        district = district1;
    }   
    convar.getConnection((err) => {
        if (err) throw err;
        console.log("Connected to the database");
        if (!district) {
        const sql =   `SELECT officename, pincode, Deliverystatus, Taluk, Districtname, statename, Telephone FROM mytable WHERE statename = "${state}"`;
        convar.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
            if (result.length==0){
                var status ="error";
            }
            else{
                var status = "ok";
            }
            output={
                message:   `Number of post offices found ${result.length}`,
                status: status,
                postoffice:result
            };
             res.json(output);
        });
    }
            
        else{
        const sql =   `SELECT officename, pincode, Deliverystatus, Taluk, Districtname, statename, Telephone FROM mytable WHERE statename = "${state}" AND Districtname = "${district}"`;
        convar.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
            //  result = result;
            if (result.length==0){
                var status ="error";
            }
            else{
                var status = "ok";
            }
            output={
                message:   `Number of post offices found ${result.length}`,
                status: status,
                postoffice:result
            };
             res.json(output);
        });
            }
    });


});

app.get('/api/states/:id', (req,res) => {
    var state = req.params.id;
    convar.getConnection((err) => {
        if (err) throw err;
        var sql = `SELECT Districtname FROM mytable WHERE statename = "${state}"`;
        convar.query(sql, (err, result) => {
            if (err) throw errr;
            // console.log(result);
            res.json(result);
        })
    })
})

app.get('/api/statenames/', (req,res) => {
    
    convar.getConnection((err) => {
        if (err) throw err;
        var sql = `SELECT statename FROM mytable`;
        convar.query(sql, (err, result) => {
            if (err) throw errr;
            // console.log(result);
            res.json(result);
        })
    })
})


app.get('/testing',(req,res)=>{
    
    res.write(`<h1 style="color:blue;padding:10px"> This website is powered by Nodejs server..</h1>`);
    res.write(`<p>${req.url}</p>`);
    res.end();
})

 app.get('/*', (req,res)=>{
     if(err) return  console.log(err);
    res.sendFile(path.resolve('./dist/postal-api/index.html'));
 })
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on the port:${port}`);
} );
