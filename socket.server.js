const Message = require('./model/message').createModel;
const User = require('./model/user').createModel;
const socket_io = require('socket.io');
exports.createSocket = function (app) {
    const io = socket_io.listen(app);
    connect(io);
}

/**
 * 连接
 */
let connect = (io) => {
    io.on('connection', (socket) => {
        
        //监听登录
        login(socket);
        //监听登出
        logout(socket);
        //监听信息
        serverMsg(socket);

    });


}

/**
 * 用户列表
 */
let users = {};

/**
 * 接受信息发布
 */
let serverMsg = (socket) => {
    socket.on('server_msg', (data) => {
        let nick = data.user.nick;
        let message = new Message(1, data.msg, nick);
        socket.broadcast.emit('client_msg', message);
    });
}

/**
 * 登录
 */
let login = (socket) => {
    socket.on('login', (data) => {
        let message = new Message(0, data.nick, null);
        let user = new User(socket.id, data.nick);
        users[socket.id] = data.nick;
        socket.broadcast.emit('login', { msg: message, user: user });
        socket.emit('setId', { id: socket.id, users: users });
    });
}

/**
 * 断开连接
 */
let logout = (socket) => {
    socket.on('disconnect', () => {
        let nick = users[socket.id];
        let message = new Message(0, nick, null);
        delete users[socket.id]; //将退出的用户从在线列表中删除
        socket.broadcast.emit('logout', { msg: message, id: socket.id });
    })
}





