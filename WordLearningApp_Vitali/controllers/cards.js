const path = require('path')
const cardModel = require('../models/cards');
const userModel = require('../models/users')
const {getData} = require('./token');
const sessionController = require('./sessions');

module.exports = cardsController = {

    getCards: async(req, res) => {
        try{
            handleCookie(req, async ({username, err}) => {
                if(err){
                    return res.status(400).json(err);
                }

                const cards = await cardModel.getAll(username);
                res.status(200).json({
                    cards: cards,
                    username: username
                });
            })
        }
        catch (err){
            return res.status(400).json({err: String(err)});
        }
    },

    create: async(req, res) => {
        try{
            handleCookie(req, async({username, err}) => {
                // console.log('cardController.create...')
                const {front, back, index} = req.body;
                // console.log('front', front, 'back', back, 'username', username, 'index', index);
                const info = await cardModel.create(username, front, back, index);
                // console.log('info', info)
                res.status(200).json(info);
            })
        }
        catch (err){
            return res.status(400).json({err: String(err)});
        }
    },

    update: async(req, res) => {
        // console.log('server:', req.body)
        try {
            await handleCookie(req, async({username, err}) => {
                const {reorder} = req.body;
                if(reorder){
                    const updated = await cardModel.reorder(username, reorder); 
                    return res.status(200).json(updated);
                }
                const updated = await cardModel.update(req.body);
                return res.status(200).json(updated);
            })
        }
        catch(err){
            return res.status(400).json({err: String(err)});
        }
    },

    startSession: async (req, res) => {
        try{
            console.log('handling startSession')
            await handleCookie(req, async({username, err}) => {
                const {range, finish} = req.body;
                
                if(range !== undefined){
                    // console.log('here')
                    sessionController.remove(username);
                    sessionController.add(username, range);
                    console.log('pending', sessionController.pending)
                }
                else if(finish){
                    // sessionController.remove(username);
                }

                // console.log('redirecting')
                res.status(200).json({success: true}) 
            })
        }
        catch(err){
            return res.status(400).json({err: String(err)});
        }
    },

    getSessionPage: async (req, res) => {
        console.log('session page')
        try{
            await handleCookie(req, async({username, err}) => {
                console.log(`session page (${username}):...`)
                res.sendFile(path.join(__dirname, '../public/session/index.html'));
            })
        }
        catch(err){
            return res.status(400).json({err: String(err)});
        }
    }

}

async function handleCookie(req, callback){
    try{
        const {wordLearn: token} = req.cookies;
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