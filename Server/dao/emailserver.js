//引用发送邮件插件
var nodemailer = require('nodemailer');

//引入证书文件
var credentials = require('../config/credentials');

//创建传输方式
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: credentials.qq.user,
        pass: credentials.qq.pass,
    }
});

//注册发送邮件给用户
exports.emailSignUp = function (email, res) {
    // 发送消息内容
    let options = {
        from: '584604685@qq.com',
        to: email,
        subject: '感谢你在yike注册',
        html: '<span>yike欢迎您的加入</span><a href="http://localhost:8080/">点击</a>'
    };

    //发送邮件
    transporter.sendMail(options, function (err, msg) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.send('邮件发送成功');
            console.log('邮件发送成功');
        }
    });
}