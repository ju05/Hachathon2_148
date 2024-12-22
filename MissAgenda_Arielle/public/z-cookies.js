// cookie

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}


setCookie('username', 'JohnDoe', 7); // Cookie expires in 7 days


function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split('=');
        if (key === name) return value;
    }
    return null; // Return null if the cookie is not found
}

console.log(getCookie('username')); // Outputs: JohnDoe

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

deleteCookie('username'); // Removes the 'username' cookie

// local storage
window.localStorage.setItem('prod', JSON.stringify(products));
let val = window.localStorage.getItem('prod');
window.localStorage.removeItem('myCat');
window.localStorage.clear();

console.log(JSON.parse(val));









