const db = require('../db/db');

module.exports = userModel = {
    exists: async (username) => {
        const [{count}] = await db('users').count('id').where('username', username);
        return Number(count) != 0;
    },

    create: async (username, hashed) => {
        const [result] = await db('users').insert({username: username, hash: hashed}, ['id', 'username']);
        return result;
    },

    getHash: async (username) => {
        const {hash} = await db('users').where('username', username).select('hash').first();
        return hash;
    },

    delete: async (username) => {
        const [result] = await db('users').where('username', username).del(['id', 'username']);
        return result;
    },

    deleteById: async (id) => {
        const [result] = await db('users').where('id', id).del(['id', 'username']);
        return result;
    },

    deleteAfter: async(timestamp) => {
        const result = await db('users').where('created', '>=', timestamp).del(['id', 'username']);
    }
}