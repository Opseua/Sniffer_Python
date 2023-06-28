let rgx = 'oogle.com*';
let rgxArr = ['*google.com*'];
let url = 'https://www.google.com/search?q=casa&oq=';

function rgxMat(a, b) {
    const c = b.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(`^${c}$`).test(a);
}


const found = rgxArr.find(m => rgxMat(url, m));
if (!!found) {
    console.log(!!found)
} else {
    console.log('nao')
}
;

