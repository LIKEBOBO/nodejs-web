const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const static=require('serve-static');

const cookieParser=require('cookie-parser');

const expressSession=require('express-session');
const multer=require('multer');
const fs=require('fs');


app.use(cookieParser());
// 세션 미들웨어는 쿠기 파서 등록 후에 등록해야ㅏ함!
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

// form에서 전달된 POST 데이터를 받기 위해 설정한다.
app.use(bodyParser.urlencoded({extended:false}) );
app.use(bodyParser.json());



//        요청 경로                        실제 위치 
app.use('/public',static(path.join(__dirname,'public')));


// port 속성을 추가한다.
app.set('port', 3000);
app.set("views", path.join(__dirname, "views") ); // 접두어
app.set("view engine", "ejs"); // 접미어


// 파일 업로드를 위한 디렉토리 설정 및 multer 객체 선언
let storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'uploads');
    },
    filename:function(req,file,callback){
        callback(null,file.originalname+Date.now());
    }
})

var upload=multer({
    storage:storage,
    limit:{
        file:10,
        fileSize:1024*1024*1024
    }
});

let carList=[
    {_id:101,name:'sonata',price:1000,company:'HYUNDAI',year:2019},
    {_id:102,name:'sonata2',price:1300,company:'HYUNDAI',year:2020},
    {_id:103,name:'sm6',price:2000,company:'SAM',year:2019},
    {_id:104,name:'sm7',price:4000,company:'SAM',year:2020},
    {_id:105,name:'k9',price:7000,company:'KIA',year:2018}
];
let seq = 104 ; 

router.route('/car/list').get((req,res)=>{
    console.log('/car/list 요청 들어옴');
    res.send(carList);
})

router.route('/car/list/:name').get((req,res)=>{
    const name = req.params.name;
    searchList=[];
    let reg1=new RegExp(name,'gi');
    for(car of carList){
        if(car.name.match(reg1)){
            searchList.push(car);
        }
    }
    res.send(searchList);
})

router.route('/showCookie').get(function(req,res){
    let cookies = req.cookies;
    console.log('cookies >>> ', cookies);
    res.send(cookies);
})

router.route('/setCookie').get((req,res)=>{
    // 쿠키 설정! 쿠키는 클라이언트 로컬에 저장됨!
    res.cookie('user',{
        id:'KIM',
        name:'보보',
        authorized:true
    });
    res.redirect('/showCookie');
})

//로그인 세션이 만들어지면 상품 목록으로 이동

router.route('/product').get((req,res)=>{
    if(req.session.user===undefined){
        res.redirect('/public/login.html');
    }else{
        console.log(req.session.user);
        req.app.render('car_list',{cars:carList},(err,html)=>{
            res.end(html);
        })
    }
});

router.route('/login').post((req,res)=>{
    var user_id=req.body.id;
    var user_pwd=req.body.user_pwd;
    if(req.session.user){
        res.redirect('/product');
    }else{
        req.session.user={
            id:user_id,
            name: 'bobo',
            authorized:true
        }
    }

    res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
    res.write('<h2> 로그인 성공! </h2>')
    res.write('<a href="/product">상품 페이지</a>')
    res.end();
});

router.route('/photo').post(upload.array('photo',1),(req,res)=>{
    res.end("file uploaded");
}
);


// 라우터 미들웨어는 맨 아래에서 설정한다.
app.use('/', router);

const expressErrorHandler= require('express-error-handler');
const errorHandler=expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});



app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
});

