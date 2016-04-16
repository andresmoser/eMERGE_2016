// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var gMapAPI = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDl33a_Or3jDJukn6_Kr8KQjqKOInEyzoM&callback=initMap"
var dbhandler = require("./dbhandler.js");

//test data
var radius = 2;
var custLat = 180.1909090;
var custLong = 125.7776200;
var user = 'Fried Twinky';
getCoordinates(radius, user, custLong, custLat);

function getCoordinates(radius, user, custLong, custLat) {
    var db = MongoClient.connect("mongodb://52.201.9.182:27017/emerge", function(err, db){
        var cursor = db.collection('sales').find(
            { name: user },
            { long: 1, lat: 1 }
            ).toArray(function(err, items) {
                //return items;
                if (checkLocation(radius, custLat, items.lat, custLong, items.long)) {
                    //print("user is in range");
                    console.log("user is in range : %s %s", items.lat, items.long);
                    return true;
                };
            });
        
        console.log(cursor);
        for (var x in cursor) {
            console.log(x);
        }
        /*
            if (checkLocation(radius, custLat, cursor.lat, custLong, cursor.long)) {
                //print("user is in range");
                console.log("user is in range : %s %s", cursor.lat, cursor.long);
                return true;
            };
        */
        });
    
}

function createFence(x,y) {
    var myLatlng = new google.maps.LatLng(x,y);
    var mapOptions = {
        zoom: 8,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
}

function checkLocation(radius, lat1, lat2, lon1, lon2) {
    radius = radius * 1.60934;
    var R = 6371000; // metres
    var l1 = lat1 * 0.0174533;
    var l2 = lat2 * .0174533;
    var dl = (lat2 - lat1) * 0.0174533;
    var de = (lon2 - lon1) * 0.0174533;

    var a = Math.sin(dl / 2) * Math.sin(dl / 2) +
            Math.cos(l1) * Math.cos(l2) *
            Math.sin(de / 2) * Math.sin(de / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    if (d > radius) {
        //print("user is NOT in range");
        console.log("distance is greater than radius, user not in range");
        return false;
    } else {
        return true;
    }
}