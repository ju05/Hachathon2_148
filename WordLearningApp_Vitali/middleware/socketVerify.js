const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const sessionController = require('../controllers/sessions')
const {getData} = require('../controllers/token')


module.exports = function verifySocket(socket, next){
    try{
        // console.log(socket.handshake);
        const auth = socket.handshake.auth;
        // console.log('auth', auth)
        // console.log('token', auth.token)
        const data = getData(auth.token);
        // console.log('socket data', data)
        const {username} = data;
        console.log('socket: username', username)
        if(username){
            // sessionController.remove(username);
            sessionController.create(username, socket.id);
            next();
        }
        else{
            console.log('something went wrong', data);
        }
    }
    catch(err){
        console.log('socket verification middleware err', String(err));
    }
}