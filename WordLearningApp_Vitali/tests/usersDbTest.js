const userModel = require('../models/users')

const {assert} = require('chai')

describe('usersdb', () => {
    let startTime;
    let bobId;

    before(async() => {
        startTime = new Date().toLocaleString();
    })

    after(async() => {
        await userModel.deleteAfter(startTime);
    })

    it('new user: alice', async () => {
        const {username, id} = await userModel.create('alice', 'password1');
        assert.equal(username, 'alice')
        assert.isOk(id)
    })

    it('new user: bob', async() => {
        const {username, id} = await userModel.create('bob', 'password2');
        assert.equal(username, 'bob')
        assert.isOk(id)
        bobId = id;
    })

    it('exists: alice', async() => {
        const exists = await userModel.exists('alice');
        assert.isTrue(exists);
    })

    it('do not exist', async() => {
        const exists = await userModel.exists('greg');
        assert.isFalse(exists);
    })

    it('hash: alice', async() => {
        const hash = await userModel.getHash('alice');
        assert.equal(hash, 'password1')
    })

    it('hash: bob', async() => {
        const hash = await userModel.getHash('bob');
        assert.equal(hash, 'password2')
    })

    it('delete user: alice', async() => {
        const {username, id} = await userModel.delete('alice');
        assert.equal(username, 'alice')
        assert.isOk(id)
    })

    it('delete by id: bob', async() => {
        const {username, id} = await userModel.deleteById(bobId);
        assert.equal(username, 'bob')
        assert.equal(id, bobId);
    })
})

