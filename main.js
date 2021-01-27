var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라는 module을 사용할 것이다

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname == '/') {
      if(queryData.id == undefined) {
          fs.readdir('./data', (err, filelist) => {
            var title = 'Welcome!';
            var content = 'Hello, Node.js';

            var list = '<ul>';
            var i = 0;
            while(i < filelist.length) {
              list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`; 
              i++;
            }
            list = list + '</ul>';

            var template = `<!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${content}</p>
            </body>
            </html>`;
            response.writeHead(200);
            response.end(template);
          })
      } else {
        fs.readdir('./data', (err, filelist) => {
          var list = '<ul>';
          var i = 0;
          while(i < filelist.length) {
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`; 
            i++;
          }
          list = list + '</ul>';
          fs.readFile(`data/${queryData.id}`, 'utf8', (err, content) => {
            var title = queryData.id;
            var template = `<!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${content}</p>
            </body>
            </html>`;
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