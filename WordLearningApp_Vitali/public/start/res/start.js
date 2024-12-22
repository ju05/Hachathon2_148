const reg = document.getElementById('reg');
const log = document.getElementById('log');
const toLogBtn = document.getElementById('toLog');
const toRegBtn = document.getElementById('toReg');

// reg.classList.add('appearing');
// log.style.display = 'none';
// reg.classList.add('none');

// setup(reg, log);
setup(log, reg);

log.style.display = 'appearing';



window.onload = function(){
    log.style.display = 'appearing';
    enable(log); 
}


const url = "http://localhost:5000"

function setup(fst, snd){
    const regBtn = document.getElementById('regBtn');
    const logBtn = document.getElementById('logBtn');

    logBtn.onclick = e => {
        e.preventDefault();
        logMe()
    }

    regBtn.onclick = e => {
        e.preventDefault();
        regMe()
    }

    toLogBtn.onclick = toLog;
    toRegBtn.onclick = toReg;

    snd.style.display = 'none';
    enable(fst);
}

async function regMe(){

    const username = document.querySelector("#reg .username").value
    const password = document.querySelector("#reg .password").value

    const response = await fetch(url + "/registration", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    const json = await response.json()
    console.log(json);
}


async function logMe(){
    const username = document.querySelector("#log .username").value
    const password = document.querySelector("#log .password").value

    console.log('username', username, 'password', password);

    const response = await fetch(url + "/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    console.log('status', response.status);
    console.log(response)
    // console.lost('headers', response.headers);

    console.log(document.cookie);
    window.location.reload()
    // const json = await response.json()
    // console.log(json)
    // const {token} = json;
    // console.log('storing token');
    // storeToken(token);
}



async function toLog(e) {
    e.preventDefault();
    disable(reg)
    await wait(600)
    reg.style.display = 'none';    
    log.style.display = 'block';
    enable(log);
}

async function toReg(e){
    e.preventDefault();
    disable(log)
    await wait(600)
    log.style.display = 'none';    
    reg.style.display = 'block';
    enable(reg);
}

function disable(element){
    element.classList.add('disappearing')
    element.classList.remove('appearing')
}

function enable(element){
    element.classList.remove('disappearing')
    element.classList.add('appearing')
}

function wait(ms){
    return new Promise(res => setTimeout(res, ms));
}

// from w3school
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

function storeToken(token){
    document.cookie=`wordLearn=${token}`;
}

// from w3school
function expireToken(){
    const d = new Date();
    d.setTime(d.getTime());
    let expires = "expires="+d.toUTCString();
    const cvalue = getToken()
    document.cookie = 'wordLearn' + "=" + cvalue + ";" + expires + ";path=/";
}

function removeToken(){
    document.cookie = 'wordLearn' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';    
}