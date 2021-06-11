//用户登录
var dbserver = require('../dao/dbserver');

//引入token
var jwt = require('../dao/jwt');

//登录
exports.signIn = function (req, res) {
    let data = req.body.data;
    let pwd = req.body.pwd;

    dbserver.userMatch(data, pwd, res);
}

// //测试
// exports.test = function (req, res) {
//     let token = req.body.token;
//     let result = jwt.verifyToken(token);

//     res.send(result);
// }