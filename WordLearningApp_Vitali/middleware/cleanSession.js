const sessionController = require('../controllers/sessions');
const handleCookie = require('./handleCookie');

module.exports = function (req, res, next){
    try{
        handleCookie(req, ({username, err}) => {
            if(err){
                console.log(err);
                // return res.status(400).json({err: err})
                return res.redirect('http://localhost:5000');
            }
            sessionController.remove(username)
            next();
            return;
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({err: String(err)});
    }
}