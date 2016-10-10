const Message = require('./model/message').createModel;
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
        let message = new Message(0, '新用户加入',null);
        socket.broadcast.emit('join', message);
        //监听登录
        login(socket);
        //监听信息
        serverMsg(socket);

    });
}

/**
 * 接受信息发布
 */
let serverMsg = (socket) => {
    socket.on('server_msg', (data) => {
        let nick = data.user.nick;
        let message = new Message(1, data.msg,nick);
        socket.broadcast.emit('client_msg', message);
        
    });
}

/**
 * 登录
 */
let login = (socket) => {
    socket.on('login', (data) => {
        let message = new Message(0, data.nick + '加入',null);
        socket.broadcast.emit('login', message);
        socket.emit('setId', { id: socket.id });
    });
}

/**
 * 断开连接
 */
let disconnect = () => {

}





