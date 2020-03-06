const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');


//쿠키 파서 설치 
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

//쿠키 미들웨어 등록 
app.use(cookieParser());
//세션 미들웨어는 쿠키 파서 미들웨어 등록 이후 사용 가능 
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

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


router.route('/showCookie').get(function(req,res){
    //저장된 쿠키를 받아오는 곳 
    //가져오는 쿠키는 사용자 컴퓨터의 모든 쿠키이므로 cookies 
    let cookies = req.cookies;
    console.log(cookies);
    res.send(cookies);

});

//쿠키 - 클라이언트에 저장됨. 쿠키를 저장하는 곳 - res
router.route('/setCookie').get(function(req,res){
    //쿠키 설정 
    res.cookie('user',{
        id:'KIM',
        name:'봉준호',
        authorized:true
    });

    res.redirect('/showCookie');
});

//로그인 세션이 만들어지면 상품 페이지가 보여짐. 
router.route('/product').get(function(req,res){
 
    //프로덕트를 볼려면 세션에 유저정보가 있어야한다. 
    if(req.session.user === undefined){
        res.redirect('/public/login.html');
    }else{
        console.log(req.session.user);
        req.app.render('car_list',{cars:carList},function(err,html){
            res.end(html);
        });
    }
});

router.route('/login').post(function(req,res){
    var user_id = req.body.id; 
    var user_pwd = req.body.passwd;

    //유저가 있으면 로그인이 되있는 거 
    if(req.session.user){
        res.redirect('/product');
    }else{
        req.session.user={
            id:user_id,
            name:'송광호',
            authorized:true
        }
    };
    res.writeHead(200,{'Content-Type':'text/html; charset=utf8'});
    res.write('<h2>로그인 성공하였습니다</h2>');
    res.write('<a href="/product">상품페이지</a>');
    res.end();
})

app.use('/', router);
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

const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
});