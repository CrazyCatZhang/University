//聊天
var dbserver = require('../dao/dbserver');

//获取一对一聊天数据
exports.msg = function (req, res) {
    let data = req.body;
    dbserver.chatMsg(data, res);
}