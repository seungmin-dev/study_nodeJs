var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라는 module을 사용할 것이다

function templateHTML(title, list, body) {
  var template = `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body} 
  </body>
  </html>`;
//body부분은 원래 title과 content로 이루어져있었는데 페이지에 따라 내용이 달라질 수도 있으므로 body로 크게 묶기
  return template;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`; 
    i++;
  }
  list = list + '</ul>';

  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname == '/') {
      if(queryData.id == undefined) {
          fs.readdir('./data', (err, filelist) => {
            var title = 'Welcome!';
            var content = 'Hello, Node.js';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${content}`);
            response.writeHead(200);
            response.end(template);
          })
      } else {
        fs.readdir('./data', (err, filelist) => {
          fs.readFile(`data/${queryData.id}`, 'utf8', (err, content) => {
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${content}`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);