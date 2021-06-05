const express = require('express');
const app = express();


const dotenv = require('dotenv');
dotenv.config();
//const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
//const nextApp = next({ dev });

const bodyParser = require('body-parser');
const request = require('request');

const port = +process.env.PORT || 8080,ip = process.env.IP || '0.0.0.0';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendStatus(200));

app.get('/test', require("./api/test"));
app.post('/webhook', require("./api/webhook"));

app.listen(port)