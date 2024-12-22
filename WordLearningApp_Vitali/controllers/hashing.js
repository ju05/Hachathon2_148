const bcrypt = require('bcrypt');

module.exports.hash = async function(password){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

module.exports.compare = async function(password, hash){
    return await bcrypt.compare(password, hash);
}