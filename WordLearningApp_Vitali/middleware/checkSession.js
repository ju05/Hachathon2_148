const sessionController = require('../controllers/sessions');
const handleCookie = require('./handleCookie');

module.exports = function(req, res, next) {
    console.log('HEEEEY')
    console.log('METHOD: ', req.method)
    try{
        handleCookie(req, ({username, err}) => {
            if(err){
                console.log('EERRRR: ', err)
                return res.redirect('http://localhost:5000');
            }
            // else if(req.method != 'GET'){
            //     next()
            // }
            console.log('pending', sessionController.pending);
            if(sessionController.isReady(username)){
                console.log('checkSession: is ready')
                next()
            }
            else {
                console.log('checkSession: NOPE')
                return res.redirect('http://localhost:5000');
            }
        })
    }
    catch(err){
        console.log('EEERRRR', err);
        return res.redirect('http://localhost:5000');
    }
}