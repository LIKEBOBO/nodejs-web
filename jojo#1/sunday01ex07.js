var fs = require('fs');
//동기 방식으로 파일 읽기 
//var data = fs.readFileSync('./package.json', 'utf8');
//console.log(data);

//비동기 방식으로 파일 읽기 
fs.readFile('./package.json', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
})
console.log('비동기');