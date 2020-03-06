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


let carList = [
    {_id:101, name:'Sonata', price:3500, company:'HYUNDAI', year:2019},
    {_id:102, name:'Sonata2', price:3100, company:'HYUNDAI2', year:2019},
    {_id:103, name:'K7', price:3200, company:'HYUNDAI3', year:2019},
    {_id:104, name:'BMW', price:3300, company:'HYUNDAI4', year:2019},
    {_id:105, name:'SM6', price:3500, company:'HYUNDAI', year:2019},
    {_id:106, name:'SM5', price:3500, company:'HYUNDAI', year:2019},

];

let seq = 104; 
router.route('/car/list/').get(function(req,res){
    //console.log("/car/list/:name 요청됨...");
    console.log("/car/list 요청됨...");
    res.send(carList);
});


router.route('/car/list/:name').get(function(req,res){
    //console.log("/car/list/:name 요청됨...");
    let name = req.params.name; 
    let searchList = [];
    let reg1 = new RegExp(name, 'gi');
    for(car of carList){
        if(car.name.match(reg1)){
            searchList.push(car);
        }
    }
    res.send(searchList);
});
// 등록되지 않은 path에 대한 페이지 오류 응답(수동설정)
// express-error-handler 모듈 설치 후 미들웨어 설정  
//npm i -S express-error-handler

var expressErrorHandler = require('express-error-handler');
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
// 라우터 미들웨어는 맨 아래에서 설정한다.
app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
});