const http=require('http');
const express=require('express');
const app=express();
const router=express.Router();
const bodyParser=require('body-parser');
const path=require('path');

app.locals.pretty=true;

const chart=['index','home','profile','car list'];
let carlist=[
    {_id:1,name:'Sonata',price:1000,company:'현대',year:2019},
    {_id:2,name:'Avante',price:1000,company:'현대',year:2020},
    {_id:3,name:'K9',price:10000,company:'KIA',year:2019},
    {_id:4,name:'BMW',price:12000,company:'BMW',year:2018},
    {_id:5,name:'BENZ',price:11000,company:'BENZ',year:2017}
];

let seq=5;




app.set('port',6123);
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

router.route('/').get((req,res)=>{
    req.app.render('index',{name:'보보'},(err,html)=>{
       if(err) throw err;
       res.send(html);
    });
});


router.route('/home').get((req,res)=>{
    req.app.render('home',{name:'보보'},(err,html)=>{
        if(err) throw err;
        res.send(html);
    });
});

router.route('/profile').get((req,res)=>{
    req.app.render('profile',{name:'보보'},(err,html)=>{
        if(err) throw err;
        res.send(html);
    });
});

router.route('/car/list').get((req,res)=>{
    req.app.render('car_list',{name:'보보',cars:carlist},(err,html)=>{
        if(err) throw err;
        res.send(html);
    });
});

router.route('/car/input').get((req,res)=>{
    req.app.render('car_form',{name:'보보'},(err,html)=>{
        if(err) throw err;
        res.send(html);
    });
});

router.route('/car/input').post((req,res)=>{
    let car_data={
        _id:++seq,
        name:req.body.name,
        price:req.body.price,
        company:req.body.company,
        year:req.body.year
    };
    carlist.push(car_data);
    res.redirect('/car/list');
});

router.route('/car/modify/:_id').get((req,res)=>{
    let _id=parseInt(req.params._id);
    req.app.render('car_modify',{name:'보보',car:carlist[_id-1]},(err,html)=>{
        if(err) throw err;
        res.send(html);
    });
});

router.route('/car/modify/:_id').post((req,res)=>{
    let _id=parseInt(req.params._id);
    carlist[_id-1].name=req.body.name;
    carlist[_id-1].price=req.body.price;
    carlist[_id-1].company=req.body.company;
    carlist[_id-1].year=req.body.year;
    res.redirect('/car/list');
});


router.route('/car/detail/:_id').get((req,res)=>{
    let _id=parseInt(req.params._id);
    let idx=carlist.findIndex((item,index)=>{
        return item._id==_id;
    });
    if(idx!=-1){
        req.app.render('car_detail',{name:'보보',car:carlist[idx]},(err,html)=>{
            if(err) throw err;
            res.send(html);
        });
    }
    else{
        res.send("not found!!!");
    }
});

router.route('/profile').get((req,res)=>{
    req.app.render('profile',{name:'보보'},(err,html)=>{
        if(err) throw err;
        res.send(html);
    });
});


app.use('/',router);


const server=http.createServer(app);
server.listen(app.get('port'),()=>{
    console.log("%d번 포트에서 작동중입니다!",app.get('port'));
});
