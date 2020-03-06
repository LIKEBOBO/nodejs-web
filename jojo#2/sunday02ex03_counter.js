const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const static=require('serve-static');


// form에서 전달된 POST 데이터를 받기 위해 설정한다.
app.use(bodyParser.urlencoded({extended:false}) );
app.use(bodyParser.json());

//        요청 경로                        실제 위치 
app.use('/public',static(path.join(__dirname,'public')));


// port 속성을 추가한다.
app.set('port', 3000);
app.set("views", path.join(__dirname, "views") ); // 접두어
app.set("view engine", "ejs"); // 접미어


//couter
let cnt = 0;
router.route('/counter').get(function(req,res){
    // 쿼리 스트링으로 전달받기!
    cnt++;
    res.end(JSON.stringify(cnt));
});

router.route('/check').get(function(req,res){
    let size=parseInt(req.query.size);
    if(cnt>size){
        res.end(JSON.stringify(cnt));
    }else{
        res.end();
    }
});

// 라우터 미들웨어는 맨 아래에서 설정한다.
app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
});