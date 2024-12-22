const cardsModel = require('../models/cards');

class Sessions{
    constructor(){
        console.log('Sessions: initialized');
        this.pending = [];
        this.sessions = [];
    }


    add(username, range){
        console.log('sessionController.ADD: ', username)
        this.pending.push({username: username, range: range});
    }

    async create(username, socketId){
        console.log('pending:', this.pending);

        const p = this.pending.filter(({username: user}) => user === username)[0]; 
        console.log('p',p);
        this.pending = this.pending.filter(({username: user}) => user !== username);

        const range = p.range;
        let cards;
        if(range.length == 0){
            console.log('FULL')
            cards = await cardsModel.getAll(username);
        }
        else {
            console.log('IN RANGE')
            cards = await cardsModel.getRange(username, range[0], range[1]);
        }

        let idx = -1;

        const session = {
            username: username, 
            socketId: socketId,

            getCurrent: () => cards[idx],
            getNext: () => {
                idx = (idx + 1) % cards.length;
                return cards[idx];
            }
        }

        this.sessions.push(session);
    }

    getBySocketId(socketId){
        return this.sessions.find(session => session.socketId = socketId)
    }

    remove(username){
        this.pending = this.pending.filter(({username: user}) => user !== username);
        this.sessions = this.sessions.filter(({username: user}) => user !== username);
    }

    isReady(username) {
        return this.pending.some(p => p.username === username);
    }
}

module.exports = new Sessions();