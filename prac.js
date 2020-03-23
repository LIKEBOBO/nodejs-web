const MongoClient=require('mongodb').MongoClient;
const ObjectID=require('mongodb').ObjectID;
const http=require('http');
const express=require('express');
const app=express();
const router=express.Router();
const bodyParser=require('body-parser');
const path=require('path');
const static=require('serve-static');
const cookieParser=require('cookie-parser');
const expressSession=require('express-session');


let cartList=[];

app.set('port',3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(cookieParser());
app.use(expressSession({
    secret:'bobo',
    resave:true,
    saveUninitialized:true
}));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/',static(path.join(__dirname,'public')));




let db=null;


function deleteCar(db,id,callback){
    let carRef=db.collection('car');
    carRef.remove({_id:new ObjectID(id)},(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        callback(null,result);
    })
}

function CarList(db,callback){
    let cars=db.collection('car');
    cars.find().toArray((err,docs)=>{
        if(err){
            console.log(err);
            return;
        }
        callback(null,docs);
    });
};

function getCar(db,car,callback){
    let carRef=db.collection('car');
    carRef.findOne(car,(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        callback(null,result);
    })
}

function changeCar(db,car,data,callback){
    let carRef=db.collection('car');
    carRef.update(car,{$set:data},(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        callback(null,result);
    })
}

function insertCar(db,data,callback){
    let carRef=db.collection('car');
    carRef.insertOne(data,(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        callback(null,result);
    });
};

function dbConnection(){
    const dbUrl='mongodb://localhost';
    MongoClient.connect(dbUrl,{useUnifiedTopology: true },(err,conn)=>{
        if(err){
            console.log('디비 연결 오류');
        }
        db=conn.db('db');
        console.log('연결 성공!');
    })
};



router.route('/shop').get((req,res)=>{
    if(db){
        CarList(db,(err,docs)=>{
            req.app.render('car_list',{cars:docs},(err2,html)=>{
            if(err2){
                console.log(err2);
                return;
            }
            res.end(html);
            });
        });
    }
    else{
        console.log('db 연결 오류');
    }
});

//회원 가입 페이지

router.route('/register').get((req,res)=>{
    console.log('회원가입 페이지 요청 들어옴');
    req.app.render('register',{},(err,html)=>{
        if(err) {
            console.log(err);
            return;
        }
        res.end(html);
    })
});


router.route('/register').post((req,res)=>{

})


router.route('/shop/:_id').get((req,res)=>{
    if(db){
        getCar(db,{_id:new ObjectID(req.params._id)},(err,result)=>{
            if(err){
                console.log(err);
                return;
            }

            req.app.render('car_detail',{car:result},(err1,html)=>{
                if(err1){
                    console.log(err1);
                    return;
                }
                res.end(html);
            })
        })
    }
});

router.route('/shop').post((req,res)=>{
    if(db){
        const car={
            name:req.body.name,
            price:req.body.price,
            company:req.body.company,
            year:req.body.year
        }
        insertCar(db,car,(err,result)=>{
            console.log(err);
            res.redirect('/shop');
        })
    }
})


router.route('/shop/modify/:_id').get((req,res)=>{
    if(db){
        getCar(db,{_id:new ObjectID(req.params._id)},(err,result)=>{
                req.app.render('car_modify',{car:result},(err1,html)=>{
                if(err1){
                    console.log(err1);
                    return;
                }
                res.end(html);
            })
        })
    }
});

router.route('/shop/modify/:_id').post((req,res)=>{
    if(db){
        let changedata={
            name:req.body.name,
            price:req.body.price,
            company:req.body.company,
            year:req.body.year
        };
        changeCar(db,{_id:new ObjectID(req.params._id)},changedata,(err,result)=>{
            console.log(result);
            res.redirect('/shop');
        });
    }
})



router.route('/shop/delete/:_id').get((req,res)=>{
    if(db){
        deleteCar(db,req.params._id,(err,result)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(result);
            res.redirect('/shop');
        })
    }
    else{
        console.log('db 연결 오류');
    }
})

//
// router.route('/cart').get((req,res)=>{
//     let cart=[];
//     if(req.cookies.cart){
//
//     }
//    req.app.render('cart',{cart:},(err,html)=>{
//        if(err){
//            console.log(err);
//        }
//        res.end(html);
//    })
// });
//
// router.route('/cart/:_id').get((req,res)=>{
//     if(req.cookies.cart){
//
//     }
//     else{
//
//     }
// });


// router.route('/cart/delete/:_id').get((req,res)=>{
//     if(req.cookies.cart){
//         let cart=req.cookies.cart;
//         let _id=parseInt(req.params._id);
//
//     }
//     else{
//         console.log('쿠키값이 없습니다!');
//     }
// });

let k=[1,2,3];

router.route('/cookie').get((req,res)=>{
    res.cookie('cart',k);
    var c=req.cookies.cart
    res.send(c[1]);
    console.log(typeof(req.cookies.cart));
})

app.use('/',router);

const server=http.createServer(app);
server.listen(app.get('port'),()=>{
    dbConnection();
    console.log('3000번에서 작동 중입니다!');
})