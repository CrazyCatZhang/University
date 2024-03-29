var dbserver = require('../dao/dbserver');
//引入邮箱发送方法
var emailserver = require('../dao/emailserver');
//注册页面服务
var signup = require('../server/signup');
//登录页面服务
var signin = require('../server/signin');
//搜索页面服务
var search = require('../server/search');
//用户详情页面服务
var user = require('../server/userdetail');
//好友申请页面服务
var friend = require('../server/friend');
//主页面服务
var index = require('../server/index');
//聊天页面服务
var chat = require('../server/chat');
//群页面服务
var group = require('../server/group');

module.exports = function (app) {
    app.get("/test", (req, res) => {
        dbserver.findUser(res);
        // res.send('aaaatest123');
    });

    //邮箱测试
    app.post("/mail", (req, res) => {
        let mail = req.body.mail;
        emailserver.emailSignUp(mail, res);
        // res.send(mail);
        // console.log(mail);
    })

    //注册
    app.post("/signup/add", (req, res) => {
        signup.signUp(req, res);
    });

    //用户或邮箱是否占用判断
    app.post("/signup/judge", (req, res) => {
        signup.judgeValue(req, res);
    });

    //登录页面
    //登录
    app.post("/signin/match", (req, res) => {
        signin.signIn(req, res);
    });

    //token测试
    app.post("/signin/test", (req, res) => {
        res.send('token正确');
    });

    //搜索页面
    //搜索用户
    app.post("/search/user", (req, res) => {
        search.searchUser(req, res);
    });
    //判断是否为好友
    app.post("/search/isfriend", (req, res) => {
        search.isFriend(req, res);
    });
    //搜索群
    app.post("/search/group", (req, res) => {
        search.searchGroup(req, res);
    });
    //判断是否在群内
    app.post("/search/isingroup", (req, res) => {
        search.isInGroup(req, res);
    });

    //用户详情
    //详情
    app.post("/user/detail", (req, res) => {
        user.userDetails(req, res);
    });
    //用户信息修改
    app.post("/user/update", (req, res) => {
        user.userUpdate(req, res);
    });
    //好友备注修改
    app.post("/user/markname", (req, res) => {
        user.friendMarkName(req, res);
    });
    //获取好友昵称
    app.post("/user/getmarkname", (req, res) => {
        user.getMarkName(req, res);
    });

    //好友操作
    //好友申请
    app.post("/friend/applyfriend", (req, res) => {
        friend.applyFriend(req, res);
    });
    //更新好友状态
    app.post("/friend/updatefriendstate", (req, res) => {
        friend.updateFriendState(req, res);
    });
    //拒绝好友或删除好友
    app.post("/friend/deletefriend", (req, res) => {
        friend.deleteFriend(req, res);
    });

    //首页
    //获取好友
    app.post("/index/getfriend", (req, res) => {
        index.getFriend(req, res);
    });
    //获取最后一条消息
    app.post("/index/getlastmsg", (req, res) => {
        index.getLastMsg(req, res);
    });
    //未读消息数
    app.post("/index/unreadmsg", (req, res) => {
        index.unReadMsg(req, res);
    });
    //好友消息标记已读
    app.post("/index/updatemsg", (req, res) => {
        index.updateMsg(req, res);
    });

    //获取群
    app.post("/index/getgroup", (req, res) => {
        index.getGroup(req, res);
    });
    //获取群最后一条消息
    app.post("/index/getlastgroupmsg", (req, res) => {
        index.getLastGroupMsg(req, res);
    });
    //群消息标记已读
    app.post("/index/updategroupmsg", (req, res) => {
        index.updateGroupMsg(req, res);
    });

    //聊天
    //聊天消息
    app.post("/chat/chatmsg", (req, res) => {
        chat.msg(req, res);
    });

    //群操作
    //新建群
    app.post("/group/creategroup", (req, res) => {
        group.createGroup(req, res);
    });
};
