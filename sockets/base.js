module.exports = function (io) {
io.sockets.on('connection',function (socket) {
    console.log('socket connected');
    socket.on('send message',function (data) {
       io.sockets.emit('new massage',{msg:data})
    });
})
};