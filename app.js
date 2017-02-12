var express = require('express'); // import express object reference 
var mongoose = require('mongoose');

// open connection to DB, passing in mongodb conn string => like a dbContext
var db = mongoose.connect('mongodb://localhost:12345/bookApi');

// this return our book model hook up to mongoose that gets form mongoDb
var Book = require('./models/bookModel');

//  express instance
var app = express();

// setup a port
var port = process.env.PORT || 3333; // if this does not return : process.env.PORT return 3333

var bookRouter = express.Router(); // router instance

// Get all
bookRouter.route('/Books')
    .get(function(req, res){
        // query string ... like OData
        var query = req.query;
        Book.find(query, function(err, books){
            if(err){
                console.error(err);
                res.status(500).send(err); // send 500 and details to cleint
            }
            else{
                console.log('success');
                res.json(books);
            }
        });
    });

// Get by ID
bookRouter.route('/Books/:bookId')
    .get(function(req, res){
        // params bookId must match match the route string above e.g. '/Books/:bookId'
        Book.findById(req.params.bookId ,function(err, book){
            if(err){
                console.error(err);
                res.status(500).send(err); // send 500 and details to cleint
            }
            else{
                console.log('success');
                res.json(book);
            }
        });
    });

app.use('/api', bookRouter);

// setup a handler for a route, when it hits the root
// param root, callback()
app.get('/', function(req, res){
    // send => string of text
    res.send('Hi from express ReST web api using node and gulp')
})

// Losten for connections: must listen to port and we''ll simply log on success listen to port
app.listen(port, function(){
    console.log('Gulp running app on PORT:' + port);
});

// TEst by typing node  app.js in shell/termnal/cmd/PS