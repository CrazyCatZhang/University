var dbserver = require('../dao/dbserver');
var email = require('../dao/emailserver');

//用户注册
exports.signUp = function (req, res) {
    let name = req.body.name;
    let mail = req.body.mail;
    let pwd = req.body.pwd;
    // res.send({name: name, mail: mail, pwd: pwd});
    email.emailSignUp(mail);

    dbserver.buildUser(name, mail, pwd, res);
}

//用户或邮箱是否判断
exports.judgeValue = function (req, res) {
    let data = req.body.data;
    let type = req.body.type;
    // res.send({type: type, data: data});

    dbserver.countUerValues(data, type, res);
}