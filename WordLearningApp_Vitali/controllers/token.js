const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const passport = require('passport');
const passportJwt = require('passport-jwt');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const {parsed: {SECRET}} = dotenv.config()

const jwtDecodeOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
};

passport.use(
    new JwtStrategy(jwtDecodeOptions, (payload, done) => {
        return done(null, payload.data);
    })
)

module.exports.getToken = function (info){
    const token = jwt.sign({
            data: info,
        },
        SECRET
    )
    return token;
}

module.exports.getData = function (token){
    const {data} = jwt.verify(token, SECRET);
    return data;

    // try{
    //     const token = socket.handshake.auth.token || {token: ''};
    //     const decoded = jwt.verify(token, SECRET);
    //     await online.addUser(decoded.data, socket.id);
    //     next();
    // } catch(err){
    //     console.log(err);
    // }
}