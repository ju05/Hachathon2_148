const userModel = require('../models/users');
const {getData} = require('../controllers/token');

module.exports = async function handleCookie(req, callback){
    try{
        const {wordLearn: token} = req.cookies;
        // console.log('handleCookie:', token);
        const {username} = getData(token)
        if(!username){
            callback({err: 'token error'});
            return
        }
        const exists = await userModel.exists(username);
        if(!exists){
            return res.status(400).json({err: 'user does not exist'});
        }
        await callback({username: username});
    }
    catch (err){
        callback({err: String(err)});
    }
}