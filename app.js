// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    // console.log(fname + " " + lname);
    // console.log(email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }
    ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/222931295e"
    const options = {
        method: "POST",
        auth: "ayan:6f7d87d1a0ce08cebc64870704f9b6ab-us14"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});



app.post("/failure", function(req, res) {
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function() {
    console.log('listening on port 3000');
});



// API Key
// 6f7d87d1a0ce08cebc64870704f9b6ab-us14
// list_id=506169
// audience Id: 222931295e