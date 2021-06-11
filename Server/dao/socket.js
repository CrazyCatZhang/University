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
        socket.on('msg', (msg,fromid,toid) => {
            console.log(msg);
            socket.to(users[toid]).emit('msg',msg,fromid);
        });

        //用户离开
        socket.on('disconnecting', () => {
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name];
                console.log(socket.id + ' disconnected');
            }
        });
    });
}