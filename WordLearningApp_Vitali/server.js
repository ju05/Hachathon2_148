const app = require('./app');
const {Server} = require('socket.io')
const {createServer} = require('node:http')

const userController = require('./controllers/user');
const sessionController = require('./controllers/sessions');
const middleware = require('./middleware/socketVerify');

const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
})

io.use(middleware);

io.on('connection', async(socket) => {
    console.log('connect', socket.id);

    // socket.on('current', (arg1, arg2, callback) => {
    //     const session = sessionController.getBySocketId(socket.id);
    //     if(session){
    //         callback({card: session.getCurrent()});
    //     }
    //     else {
    //         callback({err: 'not found'})
    //     }
    // })

    socket.on('next', (a1, a2, callback) => {
        const session = sessionController.getBySocketId(socket.id);
        console.log('session', session)
        if(session){
            const card = session.getNext();
            console.log(card);
            callback({card});
        }
        else{
            console.log('not found')
            callback({err: 'not found'})
        }
 
    })

    socket.on('answer', (answer) => {
        console.log('user answered: ', answer);
    })
 
    // socket.on('answer', (answer, arg2, callback) => {
    //     console.log('handling answer ', answer);
    //     // const session = sessionController.sessions[socket.id];
    //     const session = sessionController.getBySocketId(socket.id);
    //     console.log('session', session)
    //     if(session){
    //         const card = session.getNext();
    //         console.log(card);
    //         callback({card: card});
    //     }
    //     else{
    //         callback({err: 'not found'})
    //     }
    // }) 
})
 
module.exports.io = io;
module.exports.server = server;