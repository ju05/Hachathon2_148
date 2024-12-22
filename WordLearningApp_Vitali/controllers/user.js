const path = require('path')
const userModel = require('../models/users')
const cookieParser = require('cookie-parser')
const {hash, compare} = require('./hashing')
const {getToken, getData: verify, getData} = require('./token')

module.exports = userController = {

    getRegistrationPage: (req, res) => {
        throw new Error()
    },

    getLoginPage: (req, res) => {
        throw new Error()
    },

    getMainPage: async(req, res) => {
        throw new Error()
    },

    handleRegistration: async(req, res) => {
        const {username, password} = req.body;
        const exists = await userModel.exists(username);
        if(exists){
            return res.status(400).json({err: 'user exists'});
        }
        const hashed = await hash(password);
        await userModel.create(username, hashed);
        res.status(200).json({success: true});
    },

    handleLogin: async (req, res) => {
        try{
            const {username, password} = req.body;
            // console.log('handle login', username, password)
            const exists = await userModel.exists(username);
            if(!exists){
                console.log('not exists')
                return res.status(400).json({err: 'not matched'});
            }
            const hashed = await userModel.getHash(username);
            const comparison = await compare(password, hashed);
            if(!comparison){
                return res.status(400).json({err: 'not matched'});
            }
            const token = getToken({username: username});
            console.log('sending token: ', token)
            // res.status(200).json({success: true, token: token})
            res.writeHead(200, {
                'Set-Cookie': `wordLearn=${token}`,
                "Access-Control-Allow-Credentials": "true"
            })
            .send();
        } catch (err){
            console.log(err)
        }
    },

    getMain: async(req, res) => {

    },

    getPage: async(req, res) => {
        // console.log('getpage')
        console.log(req.cookies)
        // console.log(Object.keys(req.cookies))
        try {
            
            const keys = Object.keys(req.cookies);
            if(keys.length == 0){
                console.log('no token');
                res.sendFile(path.join(__dirname, '../public/start/index.html'));

            }
            else{
                console.log('wordLearn', req.cookies.wordLearn)
                const data = verify(req.cookies.wordLearn);
                console.log('data', data);
                const {username} = data
                console.log(username);
                if(username){
                    console.log('username: ', username);
                    return res.sendFile(path.join(__dirname, '../public/main/index.html')); 
                }
                else {
                    console.log('no token');
                    res.sendFile(path.join(__dirname, '../public/start/index.html'));
                }
            }

        }
        catch (err){
            return res.send(String(err));
        }
    },

    sendStartStyle: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/start/style.css'));
    },

    sendStartScript: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/start/script.js'))
    },

    sendMainStyle: (req, res) => 
        res.sendFile(path.join(__dirname, '../public/main/style.css')),

    sendMainScript: (req, res) => 
        res.sendFile(path.join(__dirname, '../public/main/script.js'))
}

