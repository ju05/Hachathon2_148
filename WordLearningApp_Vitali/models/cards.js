const db = require('../db/db')

const cardModel = {

    getAll: async(username) => {
        // console.log('getAll...')
        if(username === undefined){
            throw new Error('username is undefined');
        }
        const cards = await db('cards')
            .join('users', 'users.id', 'cards.user_id')
            .where('username', username)
            .orderBy('index', 'asc')
            .select('cards.id', 'front', 'back', 'index', 'cards.created');
        // console.log(cards);
        // console.log('cards: ...', cards);
        return cards;
    },

    getFromIndex: async(username, index) => {
        const cards = await db('cards')
            .join('users', 'users.id', 'cards.user_id')
            .where('username', username)
            .andWhere('index', '>=', index)
            .orderBy('index', 'asc')
            .select('cards.id', 'front', 'back', 'index', 'cards.created');
        return cards;
    },

    getRange: async(username, start, stop) => {
        const cards = await db('cards')
            .join('users', 'users.id', 'cards.user_id')
            .where('username', username)
            .andWhereBetween('index', [start, stop])
            .orderBy('index', 'asc')
            .select('cards.id', 'front', 'back', 'index', 'cards.created');
        return cards
    },

    create: async(username, front, back, index, crt) => {
        try{
            if(index !== undefined){
                const cards = await cardModel.getFromIndex(username, index);
                // console.log('cards', cards)
                const updated = await Promise.all(cards.map(({id, index: idx}) => 
                    cardModel.update({id: id, index: idx + 1}))) 
                const [created] = await db('cards')
                    .insert({
                        front: front,
                        back: back,
                        index: index,
                        user_id: db('users').where('username', username).select('id').first(),
                        created: (crt === undefined ? new Date().toISOString() : crt)
                    }, ['id', 'front', 'back', 'index', 'created'])
                return {
                    created: created,
                    updated: updated.flat()
                }
            }
            else {
                const [result] = await db('cards')
                    .insert({
                        front: front, 
                        back: back, 
                        index: db('cards')
                            .join('users', 'cards.user_id', 'users.id')
                            .count('cards.id')
                            .where('username', username),
                        user_id: db('users').where('username', username).select('id').first(),
                        created: crt || new Date().toISOString()
                    }, ['id', 'front', 'back', 'index', 'created'])
                return {created: result};
            }
        } 
        catch(err){
            return {err: String(err)};
        }
    },

    update: async(data) => {
        console.log('UPDATE:', data);
        const [info] = await db('cards')
            .where('id', data.id)    
            .update(data, ['id', 'front', 'back', 'index', 'created']);
        return info;
    },

    // moveCard: async(username, cardId, newIndex) => {
        
    // },

    reorder: async(username, cardIds) => {
        const updated = await Promise.all(cardIds.map((id, i) => 
            cardModel.update({id: id, index: i})))
        return {updated: updated.flat()};
    },

    delete: async(cardId) => {
        const [result] = await db('cards').where('id', cardId).del('id');
        return result;
    },

    deleteAfter: async(timestamp) => {
        const result = await db('cards').where('created', '>=', timestamp).del('id');
        return result;
    }
}

module.exports = cardModel;