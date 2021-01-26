var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라는 module을 사용할 것이다

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname == '/') {
      if(queryData.id == undefined) {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, content) => {
          var title = 'Welcome!';
          var content = 'Hello, Node.js';
          var template = `<!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${content}</p>
          </body>
          </html>`;
          response.writeHead(200);
          response.end(template);
        });
      } else {
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
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${content}</p>
          </body>
          </html>`;
          response.writeHead(200);
          response.end(template);
        });
      }
      
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);