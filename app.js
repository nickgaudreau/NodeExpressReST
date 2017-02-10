var express = require('express');

// start express
var app = express();

// setup a port
var port = process.env.PORT || 3333; // if this does not return : process.env.PORT return 3333

// setup a handler for a route, when it hits the root
// param root, callback()
app.get('/', function(req, res){
    res.send('Hi from express ReST web api')
})

// Losten for connections: must listen to port and we''ll simply log on success listen to port
app.listen(port, function(){
    console.log('Running on PORT:' + port);
});

// TEst by typing node  app.js in shell/termnal/cmd/PS