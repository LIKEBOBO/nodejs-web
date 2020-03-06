const http = require('http');

const server = http.createServer(function (request, response) {
    console.log("요청 들어 옴...");
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    response.write("<p>welcome to my home<p>");
    response.write("<p>탱자<p>");
    response.end();

});

server.listen(3000, function () {
    console.log('http://localhost:3000 서버 실행 중...');
})