const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https'); //to send requests to internet/remote apis we need to use this https lib.


const app = express();


app.use(express.static("public")); // used to link and load the static files like styles, images , icons etc via the express server

app.use(bodyParser.urlencoded({ extended: true })); // used to parse the input info received in the form of post request. 




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});


app.post('/home', (req, res) => {
    res.redirect("/");
})


app.post('/', (req, res) => {
    const body = req.body;
    const firstName = body.fName;
    const lastName = body.lName;
    const email = body.email;
    console.log(firstName, lastName, email);

    //creating the data according to the format the mailchimp accepts, read the rules or follow angela yu
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };


    const jsonData = JSON.stringify(data); //making the json object data to a single line using stringify

    //preparing the info according to the parameters of the below  https.request function
    const apikeyid = "7b30bcf73f565dbff161059011e2a342-us21";
    const usX = "21"; // in above line we have the appid hosted on us server 14;
    const appid = "158d45757c";
    const url = "https://us" + usX + ".api.mailchimp.com/3.0/lists/" + appid;

    const options = {
        method: "POST",
        auth: "angela1:" + apikeyid
    }

    // storing the result of the below function in the request variable
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }
        else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on("data", (data) => {
            // console.log(JSON.parse(data));
            console.log("yo boii");
        })
    });



    request.write(jsonData); //running the jsonData on the request variable created above
    request.end(); //must end the api calls made to external apis to avoid any issues later on.
});








app.listen(process.env.PORT || 3000, () => { // proxess.env.PORT is useful then our app is deployed on the internet server and those servers can give random port numbers from 3000 to 5000 so using that process.env.PORT helps in that . And 5000 is used for running the server locally on our machine. If the port number 3000 is available then it will run in port 3000 else it will run on random port. that's what the line says.
    console.log("server started at port 3000 broo!!");
});

//view page source
//7b30bcf73f565dbff161059011e2a342-us21
//audience id->158d45757c.
//process.env.PORT->this chooses other system port
