// const { addListener, globalObject } = await import('./globalObject.js');
// addListener(monitorGlobalObject);
// async function monitorGlobalObject(value) {
//     console.log('Valor de globalObject alterado: 1', value.inf);
// }
// await new Promise(resolve => setTimeout(resolve, (2000)));
// globalObject.inf = true;

import { writeToFile } from './writeFile.js';

console.log('globalObject RODANDO')
const data = { inf: false };
const listeners = new Set();
const globalObject = new Proxy(data, {
    set(target, key, value) {
        target[key] = value;
        globalChanged(value);
        listeners.forEach(listener => listener(target));
        return true
    }
});
function addListener(listener) { listeners.add(listener) }
function removeListener(listener) { listeners.delete(listener) }
async function globalChanged(i) {
    //console.log('globalObject ALTERADO →', i);
    writeToFile(i)
    console.log('globalObject ALTERADO');
}

export { globalObject, addListener };

