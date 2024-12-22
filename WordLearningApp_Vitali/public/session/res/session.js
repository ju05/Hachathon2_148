const showAnswerPanel = document.querySelector('#show-answer-panel');
const resultPanel = document.querySelector('#result-panel');
const [bad, good] = [...resultPanel.querySelectorAll('button')];
const showAnswerBtn = showAnswerPanel.querySelector('button');
const exitBtn = document.querySelector('#fin');

const events = {
    stateChange: createEvent(),

    answerSend: createEvent(),
    reqNext: createEvent(),
    newItem: createEvent(),



    reqFocus: createEvent(),
    reqCurrent: createEvent(),

    onAnsweringCmd: createEvent(),
    onShowAnswerCmd: createEvent(),

    finishClick: createEvent(),
}

const socket = getSocket()

// fake
events.reqNext.addListener('app', () => {
    // const newCard = {id: 0, front: 'front', back: 'back'};
    // events.newItem.invoke(newCard);

    socket.emit('next', '', '', async ({card, err}) => {
        if(err){
            console.log(err)
            await wait(5000);
            window.location.href = 'http://localhost:5000';
            return
        }
        events.newItem.invoke(card);
    })
})


// panel update
// inserting new item
// focusing
events.newItem.addListener('app', async card => {
    const {id, front,back} = card
    insertLowering();
    insertItem(id, front, back);

    const items = getItems();
    const last = items[items.length - 1];

    disablePanel(resultPanel);
    await wait(500);
    enablePanel(showAnswerPanel);
    focus(last);
})


events.onShowAnswerCmd.addListener('app', async () => {
    opening()
    disablePanel(showAnswerPanel)
    await wait(500);
    enablePanel(resultPanel);
})

// send answer
// colorize
const answer = (option) => {
    console.log('sending to server: ', option)
    socket.emit('answer', option);

    const item = getLastItem()
    if(option == 1){
        item.classList.add('red');
    }
    else {
        item.classList.add('green');
    }

    events.reqNext.invoke();    
}

bad.onclick = () => answer(1);
good.onclick = () => answer(2);
showAnswerBtn.onclick = () => events.onShowAnswerCmd.invoke();
fin.onclick = function(e){
    e.preventDefault()
    window.location.href = 'http://localhost:5000';
}


events.reqNext.invoke();


// setupShowAnswerControl()
// setupAnswerngControl()
// setupFocus()
// setupFinishHandle()
// setupBackOpeningHandle();



// // setTimeout(setupSocket, 2000);

// randomGenSetup()
// test_reqCurrentHandler()


// function setupReqNextHandle(){
    
// }

// events.stateChange.addListener('debug', console.log);

// insertItem(0, 'front', 'back')
// events.stateChange.invoke('q');

// events.reqCurrent.invoke();

function enablePanel(panel){
    panel.style.display = 'flex'
    panel.classList.remove('fade-out');
    panel.classList.add('fade-in');
}

async function disablePanel(panel){
    panel.classList.remove('fade-in');
    panel.classList.add('fade-out');
    await wait(300)
    panel.style.display = 'flex;'
}

function setupContainer(){
    // const items = [...document.querySelectorAll('.items')];
}

function requester(){
} 

function insertAndFocusAndChangePanel(){
}


function test_reqCurrentHandler(){
    events.reqCurrent.addListener('debug', () => {
        insertItem(0, 'front', 'back');
        const item = document.querySelector('.item');
        events.reqFocus.invoke(item);
    })
}

function getSocket(){
    const auth = {auth: {token: getToken()}};
    const socket = io('http://localhost:5000', auth);
    return socket;
}


async function setupSocket(){
    console.log('socket...');
    const auth = {auth: {token: getToken()}};
    console.log(auth);

    const socket = io('http://localhost:5000', auth);

    events.reqCurrent.addListener('socket', () => {
        socket.emit('current', '', '', card => {
            console.log('card: ', card);
        })
    });

    events.onAnsweringCmd.addListener('socket', async (answer) => {
        try {
            await socket.emit('answer', answer, '', async ({card, err}) => {
                console.log(card);
                const {id, front, back} = card

                let arr = getItems();
                let last = arr[arr.length - 1];
                console.log(last);
                events.reqFocus.invoke(last);
                
                insertLowering();
                insertItem(id, front, back);
                await wait(1000);
                arr = getItems();
                last = arr[arr.length - 1];
                events.reqFocus.invoke(last)
            })
        }
        catch(err){
            window.location.href = 'http://localhost:5000';
        }
    })
}

function reqCurr(){
    events.reqCurrent.invoke();
}

async function getCurrent(){

}

function getToken(){
    const pattern = /wordLearn=(?<token>[^;\s]+)$/;
    return document.cookie.match(pattern).groups.token;
}

function opening(){
    const label = document.querySelector('.selected .back label');        
    label.classList.remove('closed')
    label.classList.add('fade-in');
}

function setupBackOpeningHandle(){
    events.onShowAnswerCmd.addListener('opening', opening); 
}

function focus(item){
    const scrollable = document.getElementsByClassName('scrollable')[0];

    [...document.querySelectorAll('.selected')].forEach(item => item.classList.remove('selected'));
    item.classList.add('selected');
    const position = item.offsetTop - scrollable.offsetTop - scrollable.offsetHeight / 2;
    scrollable.scrollTo(0, position);
}

function setupFocus(){
    events.reqFocus.addListener('scroll', focus);
}

// function setupSelectionStyleHandle(){
//     function onFocus(item){
//         [...document.querySelectorAll('selected')].forEach(it => it.classList.remove('selected'));
//         item.classList.add('selected');
//     }

//     events.reqFocus.addListener('selection', onFocus);
// }

function getItems(){return [...document.querySelectorAll('.item')]}

function getLastItem(){
    const items = getItems();
    return items[items.length - 1];
}

function randomGenSetup(){
    events.onAnsweringCmd.addListener('gen',async (answer) => {

        let arr = getItems();
        if(arr.length == 0){
            insertItem(0, 'front', 'back');
        }
        let last = arr[arr.length - 1];
        console.log(last);
        events.reqFocus.invoke(last);

        insertLowering();
        insertItem(0, 'front', 'back');
        await wait(1000);
        arr = getItems();
        last = arr[arr.length - 1];
        events.reqFocus.invoke(last)
    })
}

function setupFinishHandle(){
    const btn = document.getElementById('fin');

    async function onClick(e){
        e.preventDefault();
        const response = await fetch('http://localhost:5000/session', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({finish: true})
        })

        window.location.href = 'http://localhost:5000/';
    }

    btn.onclick = onClick;
}

function insertItem(...args){
    const container = document.getElementById('container');
    const lastFiller = document.getElementsByClassName('filler')[1];
    // container.appendChild(makeItem(...args));
    container.insertBefore(makeItem(...args), lastFiller);
}

function insertLowering(){
    const container = document.getElementById('container');
    const lastFiller = container.getElementsByClassName('filler')[1];
    create('div', '.lowering', l => container.insertBefore(l, lastFiller));
}

function makeItem(id, front, back){
    return create('div', '.item', '#' + id, item => {

        create('div', '.side', '.front', side => {
            item.appendChild(side);
            create('label', 'text:' + front, label => side.appendChild(label));
        })

        create('div', '.side', '.back', side => {
            item.appendChild(side)
            create('label', '.closed', 'text:' + back, label => side.appendChild(label));    
        })

    })
}

function setupAnswerngControl(){
    const panel = document.getElementById('result-panel');
    const [bad, good] = [...panel.querySelectorAll('button')];

    function run(e){
        e.preventDefault();
        events.onAnsweringCmd.invoke(1);
        events.stateChange.invoke('q');
    }

    bad.onclick = run;
    good.onclick = run;

    events.stateChange.addListener('answer', state => {
        panel.style.display = state == 'a' ? 'flex' : 'none';
    })

    panel.style.display = 'none';
}

function setupShowAnswerControl(){
    const panel = document.getElementById('show-answer-panel');
    const btn = document.querySelector('#show-answer-panel button');

    function run(){
        events.onShowAnswerCmd.invoke();
        events.stateChange.invoke('a');
    }

    btn.onclick = function(e){
        e.preventDefault();
        run()
    }

    events.stateChange.addListener('show', state => {
        panel.style.display = state == 'q' ? 'flex' : 'none';
    })

    panel.style.display = 'block';
}

function createEvent(){
    const bus = {
        collection: {},

        addListener: (listener, fn) => {
            bus.collection[listener] = fn;
        },

        removeListener: (owner) => delete bus.collection[owner],

        invoke: arg => Object.values(bus.collection).forEach(fn => fn(arg))
    }
    return bus;
}

function create(tag, ...args){
    const el = document.createElement(tag);
    for(const arg of args){

        if(typeof arg === 'string'){
            if(arg.startsWith('#')){
                el.id = arg.substring(1);
            }
            else if(arg.startsWith('.')){
                el.classList.add(arg.substring(1));
            }
            else if(arg.startsWith('text:')){
                el.appendChild(document.createTextNode(arg.substring(5)))
            }
        }
        else if(typeof arg === 'function'){
            arg(el);
        }
    }
    return el;
}

function wait(ms){
    return new Promise(res => setTimeout(res, ms))
}