const app = require('http').createServer();
const socket = require('./socket.server');

socket.createSocket(app);

app.listen(3000, () => {
    console.log('listen to 3000 port');
});




