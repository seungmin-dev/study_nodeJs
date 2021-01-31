var fs = require('fs');

//readFileSync
// console.log('A');
// var result = fs.readFileSync('syntax/sample.txt', 'utf8');
// console.log(result);
// console.log('C');

//readFile
console.log('A');
var result = fs.readFile('syntax/sample.txt', 'utf8', (err, data) => { //비동기함수는 callback function 필요
    console.log(data);
});
console.log('C');
