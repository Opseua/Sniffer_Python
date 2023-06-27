
const arrParte = ['amazon', 'bing.com']

const link = 'https://www.bing.com/search?q=casa&oq'

/* 
if (arrIgual.includes(link) || arrIgual.includes(link) || arrParte.some(s => link.includes(s))) {
    */
// if (arrIgual.includes(link) || arrParte.some(a => a.includes(link))) {
//     console.log('sim')
// } else {
//     console.log('nao')
// }

const arrIgual = ['www.bing.com', 'https://www.google.com/search?q=casa&oq=']
const str = '*google*';
const filterBy = str => arrIgual.some(a => new RegExp('^' + str.replace(/\*/g, '.*') + '$').test(a));
if(filterBy(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\(?=\*)/g, ''))){
    console.log('SIM')
}else{
    console.log('NAO')
}
