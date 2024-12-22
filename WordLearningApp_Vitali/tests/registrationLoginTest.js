const app = require('../app')
const {delete: deleteUser, exists, exists: userExists} = require('../models/users')
const {getData} = require('../controllers/token');

const request = require('supertest')
const {assert} = require('chai');

describe('registration_and_login', () => {

    let token;

    after(async() => {
        await deleteUser('alice'); 
        await deleteUser('bob')
    })


    it('alice does not exist', async() => {
        const exists = await userExists('alice');
        assert.isFalse(exists);
    })

    it('registration: alice', async() => {
        const response = await request(app)
            .post("/registration")
            .send({
                username: 'alice',
                password: 'mypassword'
            });

        assert.equal(response.status, 200);
        const data = response.body;
        console.log(data)
        assert.isTrue(data.success);
    })

    it("login: alice", async() => {
        const response = await request(app)
            .post("/login")
            .send({
                username: 'alice',
                password: 'mypassword'
            });
        assert.equal(response.status, 200);

        // const {success, token: aliceToken} = response.body;
        // token = aliceToken;
        // assert.isTrue(success);
        // assert.isOk(token);
    })

    it('alice has got a token which is verifiable', async() => {
        const {username} = getData(token);
        assert.equal(username, 'alice');
    })

    it('login: bob (he will fail)', async() => {
        const response = await request(app)
            .post("/login")
            .send({
                username: 'bob',
                password: 'mypassword'
            });
        assert.equal(response.status, 400);
    })

    it('registration: bob', async () => {
        const response = await request(app)
            .post("/registration")
            .send({
                username: 'bob',
                password: 'mypassword'
            });

        assert.equal(response.status, 200);
        const {success} = response.body;
        assert.isTrue(success);
    })

    it('login: bob (with wrong password) (he will fail)', async() => {
        const response = await request(app)
            .post("/login")
            .send({
                username: 'bob',
                password: 'wrong password'
            });
        assert.equal(response.status, 400);
    })
})