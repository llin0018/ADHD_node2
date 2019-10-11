const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const moment = require('moment');
const router = express.Router();

const app = express();

app.use("/css", express.static(__dirname + '/css'));
app.use("/fonts", express.static(__dirname + '/fonts'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/js", express.static(__dirname + '/js'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/home.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/calculator.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/calculator.html'));
});

app.get('/quiz.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/quiz.html'));
});

app.get('/mit3.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/mit3.html'));
});

app.get('/puzle.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/puzle.html'));
});

app.get('/contact.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/contact.html'));
});

app.get('/contactownloc.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/contactownloc.html'));
});

app.get('/blog.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/blog.html'));
});

app.get('/food.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/food.html'));
});

app.get('/client/client.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/client.js'));
});






//set MySql
// const mysql      = require('mysql');
// const connection = mysql.createConnection({
//     host     : 'c19.mysql.database.azure.com',
//     user     : 'linli@c19',
//     password : 'c19hosting@',
//     database : 'quickstartdb',
//     ssl: true
// });

const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'linli525415',
    database : 'adhd',

});

connection.connect();
function getLatest(result, subscription) {
    var latest = 100000000000000000000000000000000;
    let latestH;
    let latestM;
    let latestS;
    let latestResult;
    result.forEach(function (r) {
        const time = r.time.split(':');
        console.log(time);
        const h = parseInt(time[0]);
        const m = parseInt(time[1]);
        const s = parseInt(time[2]);

        let currentH;
        let currentM;
        let currentS;
        let currentSeconds;

        const seconds = h * 3600 + m * 60 + s;

        currentH = parseInt(moment().format('HH'), 10);
        currentM = parseInt(moment().format('mm'), 10);
        currentS = parseInt(moment().format('ss'), 10);
        currentSeconds = currentH * 3600 + currentM * 60 + currentS;
        if (seconds - currentSeconds > 0 && seconds - currentSeconds < latest && latest > 0){
            latest = seconds - currentSeconds;
            latestH = h;
            latestM = m;
            latestS = s;
            latestResult = r;

            console.log("big");
            console.log(latest);
            console.log("---");
        }
        if (seconds - currentSeconds > 0 && latest < 0){
            latest = seconds - currentSeconds;
            latestH = h;
            latestM = m;
            latestS = s;
            latestResult = r;

            console.log("big");
            console.log(latest);
            console.log("---");
        }
        if (seconds - currentSeconds < 0 && latest === 100000000000000000000000000000000){
            latest = seconds - currentSeconds;
            latestH = h;
            latestM = m;
            latestS = s;

            latestResult = r;
            console.log(" -1");
            console.log(latest);
            console.log("---");

        }
        if (seconds - currentSeconds < 0 && latest < 0 && seconds - currentSeconds < latest){
            latest = seconds - currentSeconds;
            latestH = h;
            latestM = m;
            latestS = s;
            latestResult = r;
            console.log("-");
            console.log(latest);
            console.log("---");
        }
    });


    console.log(latest);
    if (latest > 0){
        // getLatest(result, subscription, payload);
        latest = 100000000000000000000000000000000;
        const activities = latestResult.event;
        let option = {
            body: activities,
            icon: "https://www.pngarts.com/files/1/Xbox-PNG-Photo.png"
        };
        const payload = JSON.stringify({ title: "ADDVICE" , content: option});
        timersService(latestH, latestM, latestS, sendNotification, subscription, payload);
    }

}

function getData(subscription){
    var  sql = 'SELECT * FROM adhd.events';

    connection.query(sql,function (err, result){

        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');

        getLatest(result, subscription)

        // const time = result[0].time.split(':');
        // console.log(time);
        // const h = parseInt(time[0]);
        // const m = parseInt(time[1]);
        // const s = parseInt(time[2]);
        //
        // timersService(h, m, s, sendNotification, subscription, payload);

    });
}



// Set static path
app.use(express.static(path.join(__dirname, "client")));

router.get('/home',function(req,res){
    res.sendFile(path.join(__dirname,'home.html'));
});

app.use(bodyParser.json());

const publicVapidKey =
    "BFK5PhfCkJhUQOHbR7X9e0hKLhwN4RMAOBwhOBFqPHtiYuNpWCMdfp2dTAXe4gu3WLYBp0-fZPTUa2E4nP7Tk9M";
const privateVapidKey = "s2Fm7PMJmvETdg3mKiIG5sGz8qbIBPEZUz0UOegRWIY";

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);


const timersService = require('./timersService').timersService;

 async function sendNotification(subscription, payload){
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));

     getData(subscription, payload);
}




// Subscribe Route
app.post("/subscribe", (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;
    console.log(subscription);

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    // const payload = JSON.stringify({ title: "ADDVICE" });

    // Pass object into sendNotification
    //
    // webpush
    //     .sendNotification(subscription, payload)
    //     .catch(err => console.error(err));
    getData(subscription);



});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

