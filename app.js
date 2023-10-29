const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/postImages', express.static('postImages'));
// app.use(express.static('public'));


// middleware 
app.use(require('express').json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Route is working very well')
});


const diningRoute = require('./routes/dining.route');
app.use('/', diningRoute);






module.exports = app;