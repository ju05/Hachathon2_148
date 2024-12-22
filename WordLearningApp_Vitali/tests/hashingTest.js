const {hash, compare} = require('../controllers/hashing');
const {assert} = require('chai')


describe('hashing', () => {
    it('hash and compare', async() => {
        const somePassword = 'somePassword'
        const hashed = await hash(somePassword)
        assert.isOk(hashed)
        const result = await compare(somePassword, hashed);
        assert.isTrue(result);
    })
})