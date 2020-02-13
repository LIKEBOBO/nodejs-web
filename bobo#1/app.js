const http=require('http');
const express=require('express');
const app=express();
const router=express.Router();
const path=require('path');
const bodyParser=require('body-parser');


// form에서 전달된 POST 데이터를 받기 위해서 설정!
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// ejs는 레이아웃 잡는 데에 쓰는 것이 좋다!
app.set('port',3000);
app.set('views',path.join(__dirname,'views')); // 경로 접두어  path.join을 사용하면 운영체제에 상관없이 사용 가능!
app.set('view engine','pug'); // 경로 접미어

router.route('/').get((req,res)=>{
   req.app.render('index',{name:'보보'},(err,html)=>{
       if(err){
           console.log(err);
       }
       res.end(html);

   });
});

let car_list=[
    {_id:0,name:'소나타',price:1000,company:'현대',year:2019},
    {_id:1,name:'K7',price:2000,company:'KIA',year:2020},
    {_id:2,name:'SM6',price:3000,company:'SAMSUNG',year:2021},
    {_id:3,name:'BMW',price:4000,company:'BMW',year:2022}
];

let seq=3;


router.route('/profile').get((req,res)=>{
    req.app.render('profile',{cars:car_list},(err,html)=>{
        if(err){
            console.log(err);
        }
        res.end(html);
 
    });
 });
 

 router.route('/car/list').get((req,res)=>{
    req.app.render('car_list',{name:'행보보'},(err,html)=>{
        if(err){
            console.log(err);
        }
        res.end(html);
 
    });
 });
 


 router.route('/home').get((req,res)=>{
    req.app.render('home',{name:'행보보'},(err,html)=>{
        if(err){
            console.log(err);
        }
        res.end(html);
 
    });
 });
 
router.route('/car/input').get((req,res)=>{
    req.app.render('car_form',{},(err,html)=>{
        res.end(html);
    });
})

router.route('/car/detail/:_id').get((req,res)=>{
    let _id=parseInt(req.params._id);
    console.log(_id);


    let idx=carList.findIndex((item,index)=>{
        if(item._id==_id) return index;
    });

    console.log("idx : ",idx);
    if(idx!==-1){
        req.app.render('car_detail',{car:carList[idex]},(err,html)=>{
            res.end(html);

        });
    }
    else{
        res.end("Not Found Index");
    }
    
});


router.route('/car/modify').get((req,res)=>{
    req.app.render('car_form',{},(err,html)=>{
        res.end(html);
    });
})


router.route('/car/input').get((req,res)=>{
    req.app.render('car_form',{},(err,html)=>{
        res.end(html);
    });
})


router.route('/car/input').post((req,res)=>{
    let cardata={
        _id:++seq,
        name:req.body.name,
        price:req.body.price,
        company:req.body.company,
        year:req.body.year
    };

    car_list.push(cardata);
});



app.use('/',router);
const server=http.createServer(app);
server.listen(app.get('port'),()=>{
    console.log('localhost:%d',app.get('port'));
});