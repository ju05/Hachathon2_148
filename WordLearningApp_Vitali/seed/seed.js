const {hash} = require('../controllers/hashing');
const db = require('../db/db')
const userModel = require('../models/users')
const cardModel = require('../models/cards')
const userController = require('../controllers/user');

exports.seed = async function (db) {
    const username = 'john.doe'
    const hashed = await hash('1234')
    await userModel.create(username, hashed);

    await cardModel.create(username, 'progress', 'התקדמות');
    await cardModel.create(username, 'success', 'הצלחה');
    await cardModel.create(username, 'improvement', 'שיפור');
    await cardModel.create(username, 'opportunity', 'הזדמנות');
    await cardModel.create(username, 'developer', 'מפתח');
    await cardModel.create(username, 'institute', 'מכון');

}