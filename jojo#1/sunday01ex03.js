var calc = {};
calc.add = function (x, y) {
    return x + y;
}

calc.minus = function (x, y) {
    return x - y;
}

//객체를 모듈로 등록하기 
module.exports.calc = calc;
module.exports.sayHello = function () {
    console.log("Hello nodejs world");
};