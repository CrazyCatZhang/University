//主页
var dbserver = require('../dao/dbserver');

//获取好友列表
exports.getFriend = function (req, res) {
    let data = req.body;
    dbserver.getUsers(data, res);
}

//获取最后一条消息
exports.getLastMsg = function (req, res) {
    let data = req.body;
    dbserver.getLastMsg(data, res);
}

//未读消息数
exports.unReadMsg = function (req, res) {
    let data = req.body;
    dbserver.unReadMsg(data, res);
}

//好友消息标记已读
exports.updateMsg = function (req, res) {
    let data = req.body;
    dbserver.updateMsg(data, res);
}

//获取群列表
exports.getGroup = function (req, res) {
    let uid = req.body.uid;
    dbserver.getGroup(uid, res);
}

//获取群最后一条消息
exports.getLastGroupMsg = function (req, res) {
    let gid = req.body.gid;
    dbserver.getLastGroupMsg(gid, res);
}

//群消息标记已读
exports.updateGroupMsg = function (req, res) {
    let data = req.body;
    dbserver.updateGroupMsg(data, res);
}
