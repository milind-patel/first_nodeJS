require('es6-promise').polyfill();

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var fs = require('fs')
const pg = require('pg')  
const conString = 'postgres://node_hero_user:milind@localhost/node_hero' // make sure to match your own database's credentials

// pg.connect(conString, function (err, client, done) {  
//   if (err) {
//     return console.error('error fetching client from pool', err)
//   }
//   client.query('SELECT $1::varchar AS my_first_query', ['node hero'], function (err, result) {
//     done()

//     if (err) {
//       return console.error('error happened during query', err)
//     }
//     console.log(result.rows[0])
//     process.exit(0)
//   })
// })

'use strict'

app.get('/',function(req,res){
	res.send("Hello World");
});

app.get('/form.html',function(req,res){
	res.sendFile(__dirname + "/" + "form.html");
})

app.post('/add',urlencodedParser,function(req,res,next){
	const user = req.body;
	pg.connect(conString, function (err, client, done) {
    if (err) {
      // pass the error to the express error handler
      console.log("IF 1");
      return next(err)
    }
    console.log(user.first_name);
    client.query('INSERT INTO users (first_name, last_name) VALUES ($1, $2);', [user.first_name, user.last_name], function (err, result) {
      done() //this done callback signals the pg driver that the connection can be closed or returned to the connection pool

      if (err) {
      	console.log("IF 2")
        // pass the error to the express error handler
        return next(err)
      }

      res.send(200)
    })
  })
	// console.log("Request body is " + req.body);
	// users.push({
	//  	first_name: req.body.first_name,
	//  	last_name : req.body.last_name
	// })
	// const user = req.body
 //    fs.appendToFile('users.txt', JSON.stringify({ 
 //    		first_name: user.first_name, last_name: user.last_name 
 //    	}));
    //    res.send('successfully registered')
    
	// res.status(status).send("Sucessfully added! " + req.body.first_name);
	// res.status(status).send("Json is",users);
});



var server = app.listen(8081,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Application is listening on ",host,port);			
});
