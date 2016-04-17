var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var dbhandler = require("./dbhandler.js");
var path = require('path')
var geofence = require("./geofence.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

var user_name = "";

app.route('/')
  .get(function(req,res){
    res.sendFile('index.html', { root: "../"});
});

app.route('/login')
  .get(function(req,res) {
    res.send(user_name);
  })
  .post(function(req,res) {
    user_name=req.body.user;
    var password=req.body.password;
    console.log(user_name);
    console.log(password);
    var success = dbhandler.login(user_name,password);
    if(success==0) {
      user_name="";
    }
    res.redirect('/');

});

app.route('/sales')
  .post(function(req,res){
    var codeword=req.body.codeword;
    var headline=req.body.headline;
    var info=req.body.info;
    var range=req.body.range;
    var datetime=req.body.datetime;
    var stock=req.body.stock;
    var lat = req.body.lat;
    var long = req.body.long;
    console.log(codeword);
    console.log(headline);
    console.log(info);
    console.log(range);
    console.log(datetime);
    console.log(stock);
    console.log(lat);
    console.log(long);
    var data = {'name':headline,
                'codeword':codeword,
                'info':info,
                'range':range,
                'stock':stock,
                'long':long,
                'lat':lat,
                'endTime':datetime
              };
    dbhandler.insertData(data);
    res.redirect('/post2.html');
});

app.post('/test', function(req,res){
});

app.route('/location')
    .post(function (req, res) {
        var Lo = req.body.long2;
        var La = req.body.lat2;
        var code = req.body.bob;
        var results = geofence.getCoords(code, Lo, La);
        if (results) {
            res.redirect('/snag2.html')
        }
    }
);

app.listen(3000,function(){
    console.log("Started on PORT 3000");
});
