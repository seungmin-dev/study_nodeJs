// function a() {
//     console.log('A');
// }
// var a = function(){
//     console.log('A');
// }
//a();      function a와 var a = function() 은 같은 기능을 함
//JS에서는 function이 '값'이 될 수 있음

var a = function() {
    console.log('a');
}

function slowFunc(callback) { //여기서 callback은 var a = 다음에 나오는 function을 가리킴
    callback(); //여기서 callback()은 console.log('a')의 코드를 가리킴
}

slowFunc(a);