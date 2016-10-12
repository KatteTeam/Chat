const Message = require('./model/message').createModel;
const User = require('./model/user').createModel;
const Validate = require('./model/validate').createModel;
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
 * id:{
 *      nick:'昵称',
 *      icon:'头像地址'
 * }
 */
let users = {};

/**
 * 接受信息发布
 */
let serverMsg = (socket) => {
    socket.on('server_msg', (data) => {
        let nick = users[socket.id].nick;
        let icon = users[socket.id].icon;
        let user = new User(socket.id,users[socket.id].nick,users[socket.id].icon);
        let message = new Message(1, data.msg);
        socket.broadcast.emit('client_msg', {msg:message,user:user});
    });
}

/**
 * 登录
 */
let login = (socket) => {
    socket.on('login', (data) => {
        //验证昵称是否重复
        if (validate_nick(data.nick)) {
            users[socket.id] = {
                nick: data.nick,
                icon: data.icon
            }
            let user = new User(socket.id, data.nick, data.icon);
            let validate = new Validate(1, "设置用户信息成功");
            socket.broadcast.emit('login', { user: user });
            socket.emit('setUser', { user: user, users: users, validate: validate });
        } else {
            let validate = new Validate(0, "昵称重复，请重新输入");
            socket.emit('setUser', { validate: validate });
        }
    });
}

/**
 * 断开连接
 */
let logout = (socket) => {
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            let user = new User(socket.id, users[socket.id].nick, users[socket.id].icon);
            delete users[socket.id]; //将退出的用户从在线列表中删除
            socket.broadcast.emit('logout', {user: user });
        }
    })
}


let validate_nick = (nick) => {
    for (let id in users) {
        if (nick === users[id].nick) {
            return false;
        } else {
            return true;
        }
    }
    return true;
}




