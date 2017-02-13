var express = require('express'); // import express object reference 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// open connection to DB, passing in mongodb conn string => like a dbContext
var db = mongoose.connect('mongodb://localhost:12345/bookApi');

// this return our book model hook up to mongoose that gets form mongoDb
var Book = require('./models/bookModel');

//  express instance
var app = express();

// setup a port
var port = process.env.PORT || 3333; // if this does not return : process.env.PORT return 3333

// body parser config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// require book routes file
var bookRouter = require('./routes/bookRoutes')(Book);// exec () to return bookRouter

// define URLs
app.use('/api/books', bookRouter);
//app.use('/api/authors', authorRouter); for more...

// setup a handler for a route, when it hits the root
// param root, callback()
app.get('/',
    function(req, res) {
        // send => string of text
        res.send('Hi from express ReST web api using node and gulp');
    });

// Losten for connections: must listen to port and we''ll simply log on success listen to port
app.listen(port, function(){
    console.log('Gulp running app on PORT:' + port);
});

// TEst by typing node  app.js in shell/termnal/cmd/PS