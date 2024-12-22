const userModel = require('../models/users')
const cardModel = require('../models/cards')

const {assert} = require('chai')

describe('cards db', () => {
    let startTime;    
    
    before(async () => {
        startTime = new Date().toLocaleString();
        await userModel.create('alice', 'password 1')
        await userModel.create('bob', 'password 2')
    })

    after(async () => {
        await cardModel.deleteAfter(startTime);
        await userModel.delete('alice');
        await userModel.delete('bob');
    })

    it('create: alice new card', async() => {
        // console.log('timestamp: ', startTime);
        const data = await cardModel.create('alice', 'front', 'back');
        // console.log(data);
        const {created: {id, front, back, created}} = data;
        assert.isOk(id);
        assert.equal(front, 'front')
        assert.equal(back, 'back');
        assert.isOk(created);
    })

    it('create: alice another card one minute later', async() => {
        const timestamp = new Date(new Date().getTime() + 60000).toISOString();
        // console.log('timestamp: ', timestamp);
        const data = await cardModel.create('alice', 'front2', 'back2',1, timestamp);
        // console.log(data);
        const {created: {id, front, back, created}} = data;
        assert.isOk(id);
        assert.equal(front, 'front2')
        assert.equal(back, 'back2');
        assert.isOk(created);
    })

    it('create: bob new card', async() => {
        const {created: {id, front, back, created}} = await cardModel.create('bob', '1', '2');
        assert.isOk(id);
        assert.equal(front, '1')
        assert.equal(back, '2');
        assert.isOk(created);
    })

    it('getAll: alice has 2', async() => {
        const cards = await cardModel.getAll('alice');
        // console.log('cards: ', cards)
        assert.equal(cards.length, 2);
    })

    it('getAll: bob has 1', async() => {
        const cards = await cardModel.getAll('bob');
        assert.equal(cards.length, 1);
    })

    it('delete: alice deletes her latest card', async () => {
        const cards = await cardModel.getAll('alice');
        // const latest = cards[0];
        const latest = cards.reduce((curr, next) => next.index > curr.index ? next : curr, cards[0]);
        assert.equal(latest.front, 'front2')
        assert.equal(latest.back, 'back2')

        const cardId = latest.id;
        const {id} = await cardModel.delete(cardId);
        // console.log('latest', latest, 'cardId:',cardId, 'id', id);
        assert.equal(id, cardId);
    })

    it('getAll: alice has now only one card', async() => {
        const cards = await cardModel.getAll('alice');
        assert.equal(cards.length, 1);
    })
})

/**
 * why? - I want to sort cards by time created
 * @param {number} ms - time to wait
 */
function wait(ms){
    return new Promise(res => {
        setTimeout(res(), ms);
    })
}