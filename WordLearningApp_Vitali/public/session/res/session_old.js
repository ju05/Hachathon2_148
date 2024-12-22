const showAnswerPanel = document.getElementById('show-answer-panel');
const resultPanel = document.getElementById('result-panel');
const scrollable = document.getElementsByClassName('scrollable')[0];

let idx = 0;

// footerSwitching()
insertItems()
// scrollUpDown()

together()

async function together(){
    while(true){
        await reset()
        for(i = 0; i < 10; i++){
            await showAnswer()
            await wait(1000);
            await giveAnswer((i % 2) + 1);
            await focusNext() 
            await wait(2000);
        }
    }
}

async function reset(){
    const items = document.querySelectorAll('.item');
    items.forEach(item => closeItem(item));

    idx = 0;
    moveTo(idx);

    await switchToShowAnswerPanel();
}

async function focusNext(){
    const items = document.querySelectorAll('.item');
    idx = (idx + 1) % items.length;

    if(idx == 0){
        reset()
        await wait(100)
    }

    moveTo(idx)
    await switchToShowAnswerPanel()
    await wait(100);
    
}

async function showAnswer(){
    const items = document.querySelectorAll('.item');
    // await openItem(items[idx])
    await Promise.all([
        openItem(items[idx]),
        switchToResultPanel()
    ]);
}

async function giveAnswer(answer){
    const items = document.querySelectorAll('.item');

    if(answer == 1){
        makeRed(items[idx])       
    } else {
        makeGreen(items[idx]);
    }
    await wait(500);
}


async function scrollUpDown(){
    const items = document.querySelectorAll('.item');

    let i = 0;
    while(true){
        if(i == 0){
            items.forEach(item => closeItem(item));            
        }

        moveTo(i); 
        await wait(200);
        await openItem(items[i])
        
        await wait(300);
        if(i % 2 == 0){
            makeGreen(items[i]);
        }
        else {
            makeRed(items[i]);
        }
        // (i % 2 == 0 ? makeGreen(item) : makeRed(item))

        i = (i + 1) % 6;
        await wait(1000);
    }
}

function moveTo(idx){
    const items = document.querySelectorAll('.item');
    items.forEach(item => item.classList.remove('selected'))
    const position = items[idx].offsetTop - scrollable.offsetTop - scrollable.offsetHeight / 2;
    scrollable.scrollTo(0, position);
    items[idx].classList.add('selected');
}

function insertItems(){
    const lastFiller = document.querySelectorAll('.filler')[1];
    for(i = 0; i < 6; i++){
        scrollable.insertBefore(getItem(i, 'front ' + i, 'back ' + i), lastFiller);
    }
}

function getFront(item){return item.querySelector('.front')}
function getBack(item){return item.querySelector('.back')}
function getBackLabel(item) {return item.querySelector('.back label')}

function getSides(item){return {
    front: getFront(item),
    back: getBack(item),
    label: getBackLabel(item)
}}

function closeItem(item){
    const {front, back, label} = getSides(item);

    label.classList.remove('fade-in');
    label.style.visibility = 'hidden';

    front.classList.remove('greening');
    back.classList.remove('greening');
    front.classList.remove('redding');
    back.classList.remove('redding');

    front.classList.remove('shrinking')
    back.classList.remove('widening')

    front.classList.add('full');
    back.classList.add('closed');
}

async function openItem(item){
    const {front, back, label} = getSides(item);
    front.classList.remove('full');
    back.classList.remove('closed');

    front.classList.add('shrinking')
    back.classList.add('widening')

    await wait(300);
    label.style.visibility = 'visible';
    label.classList.add('fade-in');

}

function makeGreen(item){
    const {front, back} = getSides(item);
    front.classList.add('greening')
    back.classList.add('greening')
}

function makeRed(item){
    const {front, back} = getSides(item);
    front.classList.add('redding')
    back.classList.add('redding')
}

function getItem(id, front, back){
    return create('div', 'item', item => {

        create('div', 'front', 'side', frontDiv => {
            item.appendChild(frontDiv);
            create('label', 'text:' + front, label => frontDiv.appendChild(label))
        })

        create('div', 'back', 'side', backDiv => {
            item.appendChild(backDiv);
            create('label', 'text:' + back, label => backDiv.appendChild(label))
        })
    })
}

function create(tag, ...args){
    const el = document.createElement(tag);
    for(const arg of args){
        try {
            if(typeof arg == 'function'){
                arg(el);
            }
            else if(arg.startsWith('id:')){
                el.id = arg.substring(3);
            }
            else if(arg.startsWith('text:')){
                el.appendChild(document.createTextNode(arg.substring(5)));
            }
            else {
                el.classList.add(arg);
            }
        }
        catch(err){
            console.log(arg, err)
        }
    }
    return el;
}

async function footerSwitching(){
    while(true){
        await switchToResultPanel();
        await wait(1000);
        await switchToShowAnswerPanel();
        await wait(1000);
    }
}

async function switchToShowAnswerPanel(){
    resultPanel.classList.remove('fade-in');
    resultPanel.classList.add('fade-out');
    await wait(500);

    resultPanel.style.display = 'none';
    showAnswerPanel.style.display = 'flex';

    showAnswerPanel.classList.remove('fade-out');
    showAnswerPanel.classList.add('fade-in'); 
}

async function switchToResultPanel(){
    showAnswerPanel.classList.remove('fade-in');
    showAnswerPanel.classList.add('fade-out');
    await wait(500);

    showAnswerPanel.style.display = 'none';
    resultPanel.style.display = 'flex';

    resultPanel.classList.remove('fade-out');
    resultPanel.classList.add('fade-in'); 

}

function wait(ms){
    return new Promise(res => setTimeout(res, ms));
}