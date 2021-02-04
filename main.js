var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라는 module을 사용할 것이다
var qs = require('querystring');

function templateHTML(title, list, body, control) {
  var template = `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
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

var app = http.createServer(function(request,response){ //nodeJS가 웹서버로 접속이 들어올 때마다 호출되는 메소드 createServer
  //그리고 callback함수 호출 (바로 위에 있는 function)
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname == '/') {
      if(queryData.id == undefined) {
          fs.readdir('./data', (err, filelist) => {
            var title = 'Welcome!';
            var content = 'Hello, Node.js';
            var list = templateList(filelist);
            var template = templateHTML(title, list, 
              `<h2>${title}</h2>${content}`,
              `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(template);
          })
      } else {
        fs.readdir('./data', (err, filelist) => {
          fs.readFile(`data/${queryData.id}`, 'utf8', (err, content) => {
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, 
              `<h2>${title}</h2>${content}`,
              `<a href="/create">create</a> 
              <a href="/update?id=${title}">update</a> 
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>`
            );
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname == '/create') {
      fs.readdir('./data', (err, filelist) => {
        var title = 'Web - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="http://localhost:3000/create_process" method="POST">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="content" placeholder="content"></textarea>
            </p>
            <p><input type="submit"></p> 
          </form>
        `, '');
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname == '/create_process') {
      var body = '';
      request.on('data', data => { //post방식으로 전송하는 데이터의 양이 많을 때 한번에 대량을 받지 않고,
        //조금조금씩 받는다. 이 때 data를 인자로 받는 callback함수 호출
        body = body + data;
      });
      request.on('end', () => { //위의 함수에서 더이상 들어올 데이터가 없을 때 호출
        var post = qs.parse(body);
        var title = post.title;
        var content = post.content;
        console.log(post);
        fs.writeFile(`data/${title}`, content, 'utf8', (err) => {
          if(err) throw err; //에러가 떨어졌을 때 처리하는 방법
          response.writeHead(302, {Location: `/?id=${title}`}); //301은 URL이 영구적으로 바뀌었을 때 리다이렉션
          response.end('');
        })
      });
    } else if(pathname == '/update') {
      fs.readdir('./data', (err, filelist) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, content) => {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, 
            `
            <form action="/update_process" method="POST">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" value="${title}"></p>
              <p>
                <textarea name="content" placeholder="content">${content}</textarea>
              </p>
              <p><input type="submit"></p> 
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    } else if (pathname == '/update_process') {
      request.on('data', data => { 
        body = body + data;
      });
      request.on('end', () => { 
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        console.log('title:',title);
        var content = post.content;
        fs.rename(`data/${id}`, `data/${title}`, (err) => {
          fs.writeFile(`data/${title}`, content, 'utf8', (err) => {
            if(err) throw err;
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end('');
          });
        });
      });
    } else if (pathname == '/delete_process') {
      var body = '';
      request.on('data', data => { 
        body = body + data;
      });
      request.on('end', () => { 
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`, (err) => {
          response.writeHead(302, {Location: `/`});
          response.end();
        })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);