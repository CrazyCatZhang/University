var dbserver = require('../dao/dbserver');

//详情
exports.userDetails = function (req, res) {
    let id = req.body.id;
    dbserver.userDetails(id,res);
}

//用户信息修改
exports.userUpdate = function (req, res) {
    let data = req.body;
    dbserver.userUpdate(data,res);
}

//好友备注修改
exports.friendMarkName = function (req, res) {
    let data = req.body;
    dbserver.friendMarkName(data,res);
}

//获取好友昵称
exports.getMarkName = function (req, res) {
    let data = req.body;
    dbserver.getMarkName(data,res);
}