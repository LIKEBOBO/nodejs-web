//프로세스 값 확인 

//console.log(process.argv.length);
//console.dir(process.argv);

if(process.argv.length>2){
    for(var i=2; i<process.argv.length; i++){
        console.log(process.argv[i]);
    }
}

console.log(__dirname);
console.log(__filename);