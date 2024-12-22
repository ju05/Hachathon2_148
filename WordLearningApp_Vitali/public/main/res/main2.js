
insertFillers()


const events = {
    fetchAll: createEventBus(),
    fetchId: createEventBus(),
    fieldUpdate: createEventBus(),
    newItem: createEventBus(),
    rangeEnter: createEventBus(),
    rangeLeave: createEventBus(),
    rangeClick: createEventBus(),
    rangeSelected: createEventBus(),
    onRangeSelection: createEventBus(),
    rangeReset: createEventBus(),
    logout: createEventBus(),
    startSession: createEventBus(),
    reorder: createEventBus()
}

setupRangeSelection()
setupLogout()
setupStartButton()
setupDraggableState()


setupLogoutHandle()
setupFetchAllHandle()
setupFieldUpdateHandle()
setupNewItemHandle()
setupReorderHandle()
setupStartSessionHandle()

window.onload = () => fetchAll();

// events.fieldUpdate.addListener('debug', console.log)
// events.newItem.addListener('debug', console.log)
// events.rangeEnter.addListener('debug', console.log)
// events.rangeLeave.addListener('debug', console.log)
events.rangeSelected.addListener('debug', console.log);
events.logout.addListener('debug', console.log);
// events.startSession.addListener('debug', range => console.log('startSession', range));
events.reorder.addListener('debug', console.log);

async function fetchAll(){
    const response = await fetch('http://localhost:5000/cards');
    const data = await response.json();
    console.log('data', data);
    events.fetchAll.invoke(data);
}

function setupLogoutHandle(){
    events.logout.addListener('app', () => {
        document.cookie = 'wordLearn=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.location.reload();
    })
}

function setupStartSessionHandle(){

    let disabled = false;

    async function onEvent(range){
        if(!disabled){
            disabled = true;
            delay(300, () => disabled = false) 

            console.log('range: ', {range: range});
            let response = await fetch('http://localhost:5000/session', {
                method: 'POST',
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({range: range})
            })

            console.log('to session', response);
            window.location.href = 'http://localhost:5000/session';
        }
    }
    events.startSession.addListener('app', onEvent)
}

function setupFetchAllHandle(){
    events.fetchAll.addListener('app', ({username, cards}) => {
        console.log(username, cards)
        setHeader(username);
        cards.forEach(({id, front, back}) => insertItem(id, front, back));
    })
}

function setupNewItemHandle(){

    async function onCreate(item){
        const idx = getRangeSelArray().indexOf(item);
        console.log('getting response...');
        const response = await fetch('http://localhost:5000/cards', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({front: '', back: '', index: idx})
        })

        const json = await response.json();
        // console.log('response.body',json)
        item.id = json.created.id;
        console.log('new Id: ', item.id);
    }

    events.newItem.addListener('app', async item => await onCreate(item))
}


function setupFieldUpdateHandle(){

    async function onUpdate({front, back, id}){
        const data = front !== undefined ? {front: front, id: id} : {back: back, id: id};
        console.log('updating: ', data);
        const response = await fetch('http://localhost:5000/cards', {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response.status);
    }

    events.fieldUpdate.addListener('app', onUpdate);
}

function setupReorderHandle(){
    async function onUpdate(order){
        const response = await fetch('http://localhost:5000/cards', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({reorder: order})
        });

        console.log(response.status);
    }

    events.reorder.addListener('app', onUpdate);
}

// insertItem(0, 'dude', 'hey')
// sweepHeaders()

async function sweepHeaders(){
    const names = ['dude', 'MAN', 'john.doe'];
    let i = 0;
    while(true){
        setHeader(names[i]); 
        i = (i + 1) % names.length
        await wait(2000);
    }
}

function setHeader(username){
    const header = document.querySelector('header h1');
    header.textContent = `Hi, ${username}`
}

function wait(ms){
    return new Promise(res => setTimeout(res, ms));
}

function insertFillers(){
    const container = document.getElementById('container');
    create('div', 'filler', filler => container.appendChild(filler));
    create('div', 'filler', filler => container.appendChild(filler));
}

function insertItem(id, front, back){
    const container = document.getElementById('container');
    const lastFiller = document.getElementsByClassName('filler')[1];

    container.insertBefore(makeItem(id, front, back, events), lastFiller);
}

function getRangeSelArray(){
    return [...document.querySelectorAll('.range-sel')];
}

function setupStartButton(){
    const btn = document.getElementById('sessionBtn');
    btn.textContent = 'Start session (full)'

    let range;

    events.onRangeSelection.addListener(btn, (i) => {
        range = undefined;
        btn.disabled = true;
        btn.textContent = `Start session (from ${i}...) `;
    });
    events.rangeSelected.addListener(btn, r => {
        btn.disabled = false;
        range = r
        const [min, max] = range;
        btn.textContent = `Start session (${min} to ${max})`
    });
    events.rangeReset.addListener(btn, () => {
        range = undefined
        btn.disabled = false;
        btn.textContent = "Start session (full)"
    });
    
    btn.onclick = function(e){
        e.preventDefault();
        // console.log('range: ', range);
        const data = range ?? [];
        console.log('data to send:', data)
        events.startSession.invoke(data);
    }
}

function setupLogout(){
    const btn = document.getElementById('logout');    

    btn.onclick = function(e){
        e.preventDefault();
        events.logout.invoke('logout');
    }
}

function getImagePath(name){
    return `./res/images/${name}.svg`;
}

function minMax(v1, v2) {
    return v2 > v1 ? [v1, v2] : [v2, v1]; 
}

function setupRangeSelection() {
    let onSelection, selected, start, stop;
    const blackTri = getImagePath('blackTriangle');
    const greenTri = getImagePath('greenTriangle');
    const blackR = getImagePath('blackRect');
    const greenR = getImagePath('greenRect');
    start = -1;
    stop = -1;
    onSelection = false;
    selected = false;

    function onEnter(img){
        const arr = getRangeSelArray()
        const idx = arr.indexOf(img);
        if(selected){
            
        }
        else if(onSelection){
            const [min, max] = minMax(start, idx);
            arr.forEach((sel, i) => sel.src = i < min || i > max ? blackR : greenR); 
        }
        else {
            img.src = greenTri;
        }
    }

    function onLeave(img){
        const arr = getRangeSelArray()
        const idx = arr.indexOf(img);
        if(selected){
            
        }
        else if(onSelection){
            arr.forEach((sel, i) => sel.src = i == start ? greenR : blackR);
        }
        else {
            img.src = blackTri
        }
    }

    function onClick(img){
        const idx = getRangeSelArray().indexOf(img);
        if(selected){
            const arr = getRangeSelArray()
            arr.forEach((sel) => sel.src = blackTri);
            selected = false;
            events.rangeReset.invoke();
        }
        else if(onSelection){
            [start, stop] = minMax(start, idx);
            onSelection = false;
            selected = true;
            events.rangeSelected.invoke([start, stop]);
        }
        else {
            start = idx;
            onSelection = true;
            events.onRangeSelection.invoke(idx);
        }
    }

    events.rangeEnter.addListener('app', onEnter);
    events.rangeLeave.addListener('app', onLeave);
    events.rangeClick.addListener('app', onClick);
}

function getItems(){
    return [...document.querySelectorAll('.item')];
}

function setupDraggableState(){
    const container = document.getElementById('container');

    events.onRangeSelection.addListener('app', () => {
        console.log('drag off');
        getItems().forEach(item => item.draggable = false);
    })

    events.rangeReset.addListener('app', () => {
        console.log('drag on');
        getItems().forEach(item => item.draggable = true);
    })

    function onOver(e){
        e.preventDefault();
        // console.log('over');
        const item = document.querySelector('.dragging');
        let siblings = [...container.querySelectorAll('.item:not(.dragging)')]
        let next = siblings.find(sibling => 
            e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2 - container.scrollTop);
        container.insertBefore(item, next);
    }

    function onEnter(e){
        e.preventDefault();
    }

    function onEnd(e){
        e.preventDefault();
        // console.log('over')
        events.reorder.invoke(getItems().map(item => item.id));
    }

    container.addEventListener('dragover', onOver);
    container.addEventListener('dragenter', onEnter);
    container.addEventListener('dragend', onEnd)
}

function makeItem(id, front, back){


    return create('div', 'item', 'id:' + id,  item => {

        // async function setId(){
        //     await wait(200)
        //     const index = getItems().indexOf(item);

        //     const response = await fetch('http://localhost:5000/cards', {
        //         method: 'POST',
        //         headers: {
        //             "Content-type": "application/json"
        //         },
        //         body: JSON.stringify({front: '', back: '', index: idx})
        //     })

        //     const json = await response.json();
        //     item.id = json.created.id;
        // }
        // setId(item);
        
        create('div', 'item-btn', holder => {
            item.appendChild(holder);
            create('img', 'range-sel', img => {
                holder.appendChild(img)
                img.src = './res/images/blackTriangle.svg'

                img.onmouseenter = function(e){
                    e.preventDefault();
                    events.rangeEnter.invoke(img);
                } 

                img.onmouseleave = function(e){
                    e.preventDefault();
                    events.rangeLeave.invoke(img);
                }

                img.onclick = function(e){
                    e.preventDefault();
                    events.rangeClick.invoke(img);
                }
            })
        })

        create('div', 'side','front', holder => {
            item.appendChild(holder);
            create('input', field => {
                holder.appendChild(field);
                setupField(field, front, 'front', item.id)
            }) 
        })

        create('div', 'adder', holder => {
            item.appendChild(holder);

            create('div', 'show-area', area => {
                holder.appendChild(area)
                create('button', 'addNew', 'text:+', btn => {
                    area.appendChild(btn);
                    btn.style.display = 'none';
                    btn.onclick = () => makeNewItemAfter(item);

                    area.onmouseover = () => btn.style.display = 'block';
                    area.onmouseleave = () => btn.style.display = 'none';
                })
            })
        })

        create('div', 'side', 'back', holder => {
            item.appendChild(holder);
            create('input', field => {
                holder.appendChild(field)
                setupField(field, back, 'back', item.id)
            })
        })

        item.draggable = true;

        item.addEventListener('dragstart', async() => {
            await wait(0);
            item.classList.add('dragging');
        })

        item.addEventListener('dragend', () => item.classList.remove('dragging'));
    })
}

function makeNewItemAfter(item){
    const container = document.getElementById('container');
    const newItem = makeItem(undefined, '', '')
    container.insertBefore(newItem, item.nextSibling);
    events.newItem.invoke(newItem);
}

function setupField(field, init, fieldName, id){
    field.value = init;
    field.readOnly = true;
    field.placeholder = fieldName;

    field.addEventListener('dblclick', (e) => {
        e.preventDefault();
        field.readOnly = false;
    })


    field.addEventListener('focusout', (e) => {
        e.preventDefault();
        field.readOnly = true;

        events.fieldUpdate.invoke({[fieldName]: field.value, id: id});
    })

    // field.addEventListener('keyup', (e) => {
    //     e.preventDefault();
    //     if(e === 'Enter'){
    //         // document.activeElement.blur();
    //         field.blur();
    //     }
    // })
}

function createEventBus(){
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
            if(arg.startsWith('id:')){
                el.id = arg.substring(3);
            }
            else if(arg.startsWith('text:')){
                el.appendChild(document.createTextNode(arg.substring(5)))
            }
            else {
                el.classList.add(arg);
            }
        }
        else if(typeof arg === 'function'){
            arg(el);
        }
    }
    return el;
}

function delay(ms, fn){
    return new Promise(res => setTimeout(() => {
        fn()
        res()
    }), ms)
}