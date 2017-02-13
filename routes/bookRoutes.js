var express = require('express'); // import express object reference 

// function is good to if needed pass in data/test
var routes = function (Book) {
    var bookRouter = express.Router(); // router instance

    // Get all
    bookRouter.route('/')
        .post(function (req, res) {
            // use body parser to parse post data into JSON
            var book = new Book(req.body);
            // create new book -> document -> in mongodb 
            book.save();
            console.log(book);
            // send status created  and book returned
            res.status(201).send(book);
        })
        .get(function (req, res) {
            // query string ... like OData
            var query = req.query;
            Book.find(query, function (err, books) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else {
                    console.log('success');
                    res.json(books);
                }
            });
        });

    // Middleware / services... to intercept request, do something, then go to next step below route (or could be another service/middleware)
    // and handle error / status
    bookRouter.use('/:bookId', function (req, res, next) {

        // params bookId must match match the route string above e.g. '/Books/:bookId'
        Book.findById(req.params.bookId, function (err, book) {
            if (err) {
                console.error(err);
                res.status(500).send(err); // send 500 and details to cleint
            }
            else if (book) {
                // *** if data exist, we add to request for it to be available on next step
                req.book = book;
                next();
            }
            else { // if not found return 404
                console.log('not found!');
                res.status(404).send('Book not found');
            }
        });
    });

    // Get by ID    
    bookRouter.route('/:bookId')
        .get(function (req, res) {
            console.log('get by id success');
            res.json(req.book);
        })
        .put(function (req, res) {
            // params bookId must match match the route string above e.g. '/Books/:bookId'

            console.log('put by id success');
            req.book.title = req.body.title;
            req.book.genre = req.body.genre;
            req.book.author = req.body.author;
            req.book.read = req.body.read;

            // use callback to avoid async issue!!
            req.book.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else{ // Ok
                    res.json(req.book);
                    console.log('patch by id success');
                }
            }); 

        })
        .patch(function (req, res) {
            // we dont want to update id
            if (req.body._id)
                delete req.body._id; // delete a body prop

            // check what is in req.body, base on what prop exists we want to update req.book
            // for in loop => for every key in req.body. Match every req.body prop to req.book prop
            for (var prop in req.body) {
                if (req.body.hasOwnProperty(prop)) {
                    req.book[prop] = req.body[prop];
                }
            }
            // use callback to avoid async issue!!
            req.book.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else{ // Ok
                    res.json(req.book);
                    console.log('patch by id success');
                }
            });            
            
        })
        .delete(function (req, res) {
            // use callback for async possible issue
            req.book.remove(function(err){
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else{ // Ok                    
                    res.status(204).send('Resource deleted');
                    console.log('Deleete by id success');
                }
            });
        });

    return bookRouter;
};

module.exports = routes;