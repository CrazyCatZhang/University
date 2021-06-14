let dbserver = require('./dbserver');

module.exports = function (io) {
    var users = {}; //socket注册用户
    io.on('connection', (socket) => {
        // console.log('连接成功');
        //用户注册
        socket.on('login', (id) => {
            // console.log(id);
            console.log(socket.id);
            socket.name = id;
            users[id] = socket.id;
            socket.emit('login', socket.id);
        });

        //用户1对1消息发送
        socket.on('msg', (msg, fromid, toid) => {
            console.log(msg);
            //修改好友最后通讯时间
            dbserver.upFriendLastTime({ uid: fromid, fid: toid });
            //存储一对一消息
            dbserver.insertMsg(fromid, toid, msg.message, msg.types);
            //发送给对方
            if (users[toid]) {
                socket.to(users[toid]).emit('msg', msg, fromid, 0);
            }
            //发送给自己
            socket.emit('msg', msg, toid, 1)
        });

        //用户离开
        socket.on('disconnecting', () => {
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name];
                console.log(socket.id + ' disconnected');
            }
        });

        //加入群
        socket.on('group', function (data) {
            // console.log('群' + data);
            socket.join(data);
        });

        //接收群消息
        socket.on('groupMsg', function (msg, fromid, gid,name,img) {
            //群内广播消息
            socket.to(gid).emit('groupmsg', msg, gid, name,img);
        });
    });
}