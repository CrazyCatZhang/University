//引入解析req.body的插件
var bodyParser = require('body-parser');

//引入token
var jwt = require('./dao/jwt');

const express = require('express')
const app = express()
const port = 3000

//socket.io
var server = app.listen(8082);
var io = require('socket.io').listen(server);
require('./dao/socket')(io);

app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Credentials", true);
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method.toLowerCase() == 'options')
    res.sendStatus(200);  //让options尝试请求快速结束
  else
    next();
});

//解析前端数据
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//获取静态路径
app.use(express.static(__dirname + '/data'))

//token判断
app.use(function (req, res, next) {
  if (typeof (req.body.token) != 'undefined') {
    //处理token匹配
    let token = req.body.token;
    let tokenMatch = jwt.verifyToken(token);
    if(tokenMatch == 1) {
      //通过验证
      next();
    } else {
      //验证不通过
      res.send({status:300});
    }
  } else {
    next();
  }
})

//进入路由
require('./router/index')(app);
require('./router/files')(app);

//404界面
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//出现错误处理
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});