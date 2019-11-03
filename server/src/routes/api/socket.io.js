import Express from 'express'
const app = Express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

export const addSocketIdtoSession = (req, res, next) => {
    req.session.socketId = req.query.socketId
    next()
}

io.on('connection', (socket) => {
    // chatSocket(socket)
    console.log("socket.io connected", socket.id);
    socket.on('disconnect', () => {
        console.log("socket.io disconnected", socket.id);
    });
    socket.on('example_message', (msg) => {
        console.log('message:\t' + msg + "\t id:\t" + socket.id);
        socket.emit('example_response', 'response msg')
    })
})

io.listen(5050)

export default io