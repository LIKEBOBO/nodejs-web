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
// 요청 경로, 디렉토리 위치
app.use("/public", static(path.join(__dirname, "public")));

// port 속성을 추가한다.
app.set('port', 3000);
app.set("views", path.join(__dirname, "views") ); // 접두어
app.set("view engine", "ejs"); // 접미어

let messageList = [
    {"sender":"운영자", "message":"오신것을 환영합니다^^"},
    {"sender":"운영자", "message":"즐거운 시간 되세요^^"}
];

router.route('/send').get(function(req, res) {
    var msgData = {
        sender : req.query.sender,
        message : req.query.message
    };
    messageList.push(msgData);

    res.end();
});

router.route('/receive').get(function(req, res) {
    let size = parseInt(req.query.size);
    let length = messageList.length;
    if(length > size) {
        let newMsgData = {
            msgList : messageList.slice(size),
            length : length,
            date : new Date()
        }
        res.end(JSON.stringify(newMsgData))
    } else {
        res.end();
    }
});

// 라우터 미들웨어는 맨 아래에서 설정한다.
app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
});