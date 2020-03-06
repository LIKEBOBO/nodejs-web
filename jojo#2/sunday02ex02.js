const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');

// form에서 전달된 POST 데이터를 받기 위해 설정한다.
app.use(bodyParser.urlencoded({extended:false}) );
app.use(bodyParser.json());


//static 미들웨어 사용 앞에 퍼블릭은 요청 경로,  뒤에 퍼블릭을 실제 디렉토리 위치 
app.use("/public",static(path.join(__dirname, "public")));

// port 속성을 추가한다.
app.set('port', 3000);
app.set("views", path.join(__dirname, "views") ); // 접두어
app.set("view engine", "ejs"); // 접미어

router.route('/plus/:a/:b').get(function(req, res) {
    
    res.end(JSON.stringify(parseInt(req.params.a+parseInt(req.params.b))));


});
router.route('/minus/:a/:b').get(function(req, res) {
    
    res.end(JSON.stringify(parseInt(req.params.a+parseInt(req.params.b))));

});
router.route('/multi/:a/:b').get(function(req, res) {
    res.end(JSON.stringify(parseInt(req.params.a+parseInt(req.params.b))));    

});
router.route('/div/:a/:b').get(function(req, res) {
    res.end(JSON.stringify(parseInt(req.params.a+parseInt(req.params.b))));
    

});

// 라우터 미들웨어는 맨 아래에서 설정한다.
app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
});