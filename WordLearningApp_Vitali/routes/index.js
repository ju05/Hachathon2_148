const express = require('express')
const userController = require('../controllers/user')
const cardController = require('../controllers/cards')
const cookieParser = require('cookie-parser');
const checkSession = require('../middleware/checkSession');
const cleanSession = require('../middleware/cleanSession');

const router = express.Router()

router.use(express.json())
router.use(cookieParser())
// router.use('/session', checkSession);

router.route('/registration')
    .post(userController.handleRegistration)

router.route('/login')
    .post(userController.handleLogin)

router.route('/cards')
    .get(cardController.getCards)
    .post(cardController.create)
    .put(cardController.update)

router.route('/')
    // .get(cleanSession)
    .get(userController.getPage)


router.route('/session')
    .get(checkSession)
    .get(cardController.getSessionPage)
    .post(cardController.startSession)
    

module.exports = router;