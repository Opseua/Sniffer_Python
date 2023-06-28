// let rgx = 'oogle.com*';
// let rgxArr = ['*google.com*'];
// let url = 'https://www.google.com/search?q=casa&oq=';

function rgxMat(a, b) {// [1] REGEX | [2] ARRAY
    const c = b.replace(/[+.?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(`^${c}$`).test(a);
}


// const found = rgxArr.find(m => rgxMat(url, m));
// if (!!found) {
//     console.log(!!found)
// } else {
//     console.log('nao')
// }
;

const str = '  \u003cmetadata labelInputName\u003d\"query\" raterVisibleName\u003d\"Search Experience to Product Usefulness\"/\u003e\n  \u003cinputTemplate\u003e\n    \u003csimpleComponent contextDataColumnName\u003d\"QueryEventMessage\" contextDataPognlPath\u003d\"raw_query\" name\u003d\"query\"/\u003e\n    \u003clocationComponent '
const nameTask = str.match(/raterVisibleName\u003d\"(.*)\"\/\u003e\n  \u003cinputTemplate/);

let tsk
if (nameTask) {
    tsk = nameTask[1];
} else {
    tsk = 'NAO ENCONTRADO';
}
console.log(tsk);