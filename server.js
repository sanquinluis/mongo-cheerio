//dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
//Scraping tools
var request = require('request');
var cheerio = require('cheerio');

//use morgan and bodyparser with app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended:false
}));
 
//make public a static dir
app.use(express.static('public'));

// set up handlebars default layout and view engine
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
