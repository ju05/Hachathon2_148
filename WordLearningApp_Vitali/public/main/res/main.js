/*
TODO

[ ] header
    [x] greeting
    [x] log out button

[x] insert between
    [x] part of items

[ ] drag n drop
    [x] makeTItem
    [x] item has a holder
    [x] make filler
    [x] smooth scrolling
    [x] make dragger
    [ ] make fillers fixed
*/

class Range{
    static onSelection = false;
    static selected = false;

    static btns = []

    static startIdx = -1;
    static stopIdx = -1;
    static range = {start: -1, stop: -1};

    static updateFn;

    static updateOrder(){
        Range.btns = [...document.querySelectorAll('.range-sel')];
    }

    static getItem(id, onStartRange, onStopRange){
        const blackTri = './res/images/blackTriangle.svg'
        const blackR = './res/images/blackRect.svg'
        const greenTri = './res/images/greenTriangle.svg'
        const greenR = './res/images/greenRect.svg' 

        const itemBtn = document.createElement('div');
        itemBtn.classList.add('item-btn');

        const img = document.createElement('img');
        img.classList.add('range-sel')
        img.src = blackTri;
        itemBtn.appendChild(img);

        img.onclick = function (e){
            e.preventDefault();
            if(Range.selected){
                Range.selected = false;
                Range.onSelection = false;
                Range.startIdx = -1;
                Range.stopIdx = -1;

                Range.btns.forEach(function(im){
                    im.src = blackTri;
                })
                if(Range.updateFn){
                    Range.updateFn({});
                }
            }
            else if(!Range.onSelection){
                img.src = greenR;
                Range.startIdx = Range.btns.indexOf(img);
                Range.onSelection = true;
                if(Range.updateFn){
                    Range.updateFn({start: Range.startIdx});
                }
            }
            else {
                Range.range = {
                    start: Math.min(Range.startIdx, Range.stopIdx),
                    stop: Math.max(Range.startIdx, Range.stopIdx)
                };
                Range.selected = true;
                if(Range.updateFn){
                    Range.updateFn(Range.range);
                }
            }
        } 

        img.onmouseenter = function (e){
            e.preventDefault();
            if(Range.selected){

            }
            else if(!Range.onSelection){
                img.src = greenTri;
            }
            else {
                Range.stopIdx = Range.btns.indexOf(img);
                Range.btns.forEach(function (im, i) {
                    if(i < Math.min(Range.startIdx, Range.stopIdx) || i > Math.max(Range.startIdx, Range.stopIdx)){
                        im.src = blackR;
                    } else {
                        im.src = greenR;
                    }
                })
            }
        }

        img.onmouseleave = function (e){
            e.preventDefault();
            if(Range.selected){

            }
            else if(!Range.onSelection){
                img.src = blackTri;
            }
            else {
                Range.stopIdx = -1;
                Range.btns.forEach(function (im, i){
                    if(i != Range.startIdx){
                        im.src = blackR;
                    } else {
                        im.src = greenR;
                    }
                })
            }
        }
        return itemBtn;
    }
}

class SessionBtn {

    static btn;

    static onStart;
    static range;

    static setup(){
        SessionBtn.btn = document.getElementById('sessionBtn');
        SessionBtn.btn.disabled = true; 
        SessionBtn.btn.textContent = 'Select start of range';

        SessionBtn.btn.onclick = (e) => {
            e.preventDefault();
            if(SessionBtn.onStart){
                SessionBtn.onStart(SessionBtn.range);
            }
        }
    }

    static handleRange(r){
        const {start, stop} = r;
        
        if(start && stop){
            SessionBtn.btn.textContent = 'Start session';
            SessionBtn.btn.disabled = false;
            SessionBtn.range = r;
        }
        else if(start){
            SessionBtn.btn.textContent = 'Select end of range';
            SessionBtn.btn.disabled = true;
        }
        else {
            SessionBtn.btn.disabled = true; 
            SessionBtn.btn.textContent = 'Select start of range';
        }
    }
}

const container = document.getElementById('container');

setupLogOut()

const cards = [
    {id: 1, front: 'front1', back: 'back1'},
    {id: 2, front: 'front2', back: 'back2'},
    {id: 3, front: 'front3', back: 'back3'},
]

insertItems(cards);

const items = []

function setHeader(username){
    const header = document.querySelector('header h1');
    header.textContent = `Hi, ${username}`
}



function insertItems(items){
    const container = document.getElementById('container');
    const lastFiller = document.getElementsByClassName('filler')[1];

    for(const {id, front, back} in items){
        const item = makeItem(id, front, back)
        container.insertBefore(item, lastFiller);
    }
}

function setupLogOut(){

    function getToken(){
    let name = 'wordLearn' + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
    }

    function expireToken(){
        const d = new Date();
        d.setTime(d.getTime());
        let expires = "expires="+d.toUTCString();
        const cvalue = getToken()
        document.cookie = 'wordLearn' + "=" + cvalue + ";" + expires + ";path=/";
    }

    const btn = document.getElementById('logout');

    btn.onclick = function(e) {
        expireToken();
        window.location.reload()
    }

}


// container.appendChild(getFiller());
// for(i = 0; i < 20; i++){
//     const item = makeItem(i, 'front' + i, 'back' + i);
//     container.appendChild(item);
//     items.push(item);
// }
// container.appendChild(getFiller());

Range.updateOrder();

async function scrollUpDOwn(){
    for(i = 0; i < 20; i++){
        move(i);
        await wait(1000);
    }
}

function initList(e) {
    e.preventDefault()
    const item = document.querySelector('.dragging');
    let siblings = [...container.querySelectorAll('.item:not(.dragging)')]

    let nextSibling = siblings.find((sibling) => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2 - container.scrollTop;
    })

    container.insertBefore(item, nextSibling);
}

container.addEventListener('dragover', initList)
container.addEventListener('dragenter', (e) => {
    e.preventDefault();
    Range.updateOrder();
});

SessionBtn.setup();
Range.updateFn = SessionBtn.handleRange;
SessionBtn.onStart = console.log;


function wrapIntoHolder(el){
    const holder = document.createElement('div');
    holder.classList.add('holder');
    holder.appendChild(el);
    return holder;
}

function makeItem(id, front, back){
    const div = document.createElement('div')
    div.classList.add('item');
    div.id = id;
    div.draggable = true;


    div.appendChild(Range.getItem(id));
    div.appendChild(getFront(front));
    div.appendChild(makeAdder(id));
    div.appendChild(getBack(back));
    // div.appendChild(getDragger(id));

    div.addEventListener('dragstart', async () => {
        await wait(0);
        div.classList.add('dragging');
    })

    div.addEventListener('dragend', () => div.classList.remove('dragging'));

    return div;
}


function getItemBtn(id, onPress){
    const itemBtn = document.createElement('div');
    itemBtn.classList.add('item-btn');

    const img = document.createElement('div');
    img.classList.add('range-sel')
    itemBtn.appendChild(img);

    img.onclick = function (e){
        e.preventDefault();
        onPress(id);
    } 

    return {
        element: itemBtn,
        resetFn: () => {}
    }
}

function getFront(value){
    const front = document.createElement('div');
    front.classList.add('front');
    const field = document.createElement('input');
    field.type = 'text';
    field.value = value;
    field.readOnly = true;

    field.addEventListener('dblclick', (e) => field.readOnly = false);
    field.addEventListener('focusout', (e) => field.readOnly = true);

    front.appendChild(field);
    return front;
}

function getBack(value){
    const back = document.createElement('div');
    back.classList.add('back');
    const field = document.createElement('input');
    field.type = 'text';
    field.value = value;
    field.readOnly = true;

    field.addEventListener('dblclick', (e) => field.readOnly = false);
    field.addEventListener('focusout', (e) => field.readOnly = true);

    back.appendChild(field);
    return back;
}

function getDragger(idx){
    const div = document.createElement('div');
    div.classList.add('dragger');
    return div;
}


function makeAdder(idx){
    const div = document.createElement('div');
    div.classList.add('adder');

    const area = document.createElement('div');
    area.classList.add('show-area');
    div.appendChild(area);

    const btn = document.createElement('button');
    btn.appendChild(document.createTextNode('+'));
    btn.classList.add('addNew');
    area.appendChild(btn);
    btn.style.visibility = 'hidden';

    area.onmouseenter = () => btn.style.visibility = 'visible';
    area.onmouseleave = () => btn.style.visibility = 'hidden';

    return div;
}

function getFiller(parent){
    const div = document.createElement('div')
    div.classList.add(['filler']);
    return div;
}


function move(idx){
    container.scrollTo(0, getTop(idx) - container.offsetHeight / 2);
}


function getTop(idx){
    return items[idx].offsetTop - container.offsetTop;
}

function wait(ms){
    return new Promise(res => setTimeout(res, ms));
}