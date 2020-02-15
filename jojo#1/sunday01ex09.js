const http = require('http');
const express = require('express');
const app = express();
//port 속성을 추가한다. 
app.set('port', 3000);

app.get('/',function(req,res){
    console.log("/요청들어옴...");
    res.end("index page ...");
});

app.get('/profile',function(req,res){
    console.log("/profile 요청들어옴...");
    res.end("profile index page ...");
});

app.get('/home',function(req,res){
    console.log("/home 요청들어옴...");
    res.end("home index page ...");
});

const server = http.createServer(app); 
server.listen(app.get('port'), function(){
    console.log('http://localhost:%d', app.get('port'));
})