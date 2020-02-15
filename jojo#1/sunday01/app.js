const http = require('http');
const express = require('express');
const app = express();
const router = express.Router(); //라우터 받아오기 
const path = require('path');

//라우터 제외미들웨어는 위에서
const bodyParser = require('body-parser');
//app.use(bodyParser()); //직접 넣기

//form에서 저장된 POST 데이터를 받기 위해 설정한다. 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//port 속성을 추가한다. 
app.set('port', 3000);
app.set("views",path.join(__dirname,'views'));//ejs파일이 저장된 폴더를 써준다. 
app.set("view engine", "ejs"); //접미어 

router.route('/').get(function(req,res){
    req.app.render('index', {name:"짱구"}, function(err,html){
        if(err){
            console.log('ERROR >>> /랜더링에러', err);
            res.end("ERROR >>> /render ..."); 
            return ; 
        }
        res.end(html);
    })
})
router.route('/home').get(function(req,res){
    req.app.render('home', {name:"짱구"}, function(err,html){
        if(err){
            console.log('ERROR >>> /랜더링에러', err);
            res.end("ERROR >>> /render ..."); 
            return ; 
        }
        res.end(html);
    })
});

router.route('/profile').get(function(req,res){
    req.app.render('profile', {name:"짱구"}, function(err,html){
        if(err){
            console.log('ERROR >>> /profile 랜더링에러', err);
            res.end("ERROR >>> /profile render ..."); 
            return ; 
        }
        res.end(html);
    })
});

let carList = [
    {_id:0, name:'Sonata', price:3500, company:'HYUNDAI', year:2019},
    {_id:1, name:'Sonata2', price:3100, company:'HYUNDAI2', year:2019},
    {_id:2, name:'Sonata3', price:3200, company:'HYUNDAI3', year:2019},
    {_id:3, name:'Sonata4', price:3300, company:'HYUNDAI4', year:2019}

];

let seq = 3; 

router.route('/car/list').get(function(req,res){
    req.app.render('car_list', {cars:carList}, function(err,html){
        if(err){
            console.log('ERROR >>> /car/list랜더링에러', err);
            res.end("ERROR >>> /car/list render ..."); 
            return ; 
        }
        res.end(html);
    })
});

router.route('/car/input').get(function(req,res){
    req.app.render('car_form',{}, function(arr, html){
        res.end(html);
    });
});

router.route('/car/input').post(function(req,res){
    //carList 배열에 데이터 저장
    //POST 메소드로 전송된 데이터는 body에 있다. 
    //body에 있는 데이터를 접근하려면 body-parser 미들웨어 설정해줘야 한다. body-parser는 외부 모듈이라 설치 필요함. 
    //npm install body-parser --save 
    let carData = {
        _id:++seq, 
        name:req.body.name, 
        price:req.body.price, 
        company:req.body.company, 
        year:req.body.year
    };
    carList.push(carData);
    res.redirect('/car/list');

});


router.route("/car/detail/:_id").get(function(req,res){
    let _id = req.params._id; 
    console.log("_id:", _id);
    let idx = carList.findIndex(function(item, index){
        if(item._id == _id){
            return index; 
        }
    }); 
    console.log("idx --->", idx); 
    if(idx != -1){
        req.app.render('car_detail', {car:carList[idx]}, function(err, html){
            res.end(html); 
        })
    }else{
        res.end("NOt found index!"); 
    }
})


//modify
router.route("/car/modify/:_id").get(function(req,res){
    var _id=req.params._id;
    req.app.render('car_modify',{car:carList[_id]}, function(arr, html){
        res.end(html);
    });
});

router.route('/car/modify/:_id').post(function(req,res){
    //carList 배열에 데이터 저장
    //POST 메소드로 전송된 데이터는 body에 있다. 
    //body에 있는 데이터를 접근하려면 body-parser 미들웨어 설정해줘야 한다. body-parser는 외부 모듈이라 설치 필요함. 
    //npm install body-parser --save 
    var _id=req.params._id;
    carList[_id]._id=req.body.name;
    carList[_id].price=req.body.price;
    carList[_id].company=req.body.company;
    carList[_id].year=req.body.year;
    res.redirect('/car/list');

});

/*
router.route('/car/modify/:_id').get(function(req, res){
    var _id=req.params._id;
    carList.remove(_id);
    res.redirect('/car/list');
})

router.route('/car/delete/:_id').post(function(req, res){
    //res.send('Got a DELETE request at /user');
    var _id=parseInt(req.params._id);
    carList.splice(_id,1);
    res.redirect('/car/list');


})
*/

router.route('/car/delete/:_id').get(function(req, res){
    //res.send('Got a DELETE request at /user');
    var _id=parseInt(req.params._id);
    carList.splice(_id,1);
    res.redirect('/car/list');


})



app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user');
  });


//미들웨어는 use 함수 이용 
//라우터 미들웨엉는 맨 아래에서 설정한다. 
app.use('/', router); // 라우터 미들웨어를 서버 실행바로 위에 쓰는게 좋다. 
const server = http.createServer(app); 
server.listen(app.get('port'), function(){
    console.log('http://localhost:%d', app.get('port'));
})