// FUNCTIONS
await import('../../../Chrome_Extension/src/resources/@functions.js');

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
// let retGetPathNew = await getPathNew({ 'e': new Error(), 'isFunction': false, })
// globalWindow.devResWs = cng == 1 ? 'CHROME' : 'SNIFFER';

let infChat, retChat
infChat = { 'provider': 'open.ai', 'input': `Qual a idade de Marte?` };
retChat = await chat(infChat);
console.log(retChat)

// FUNÇÕES DESSE PROJETO
// await import('../scripts/@ewoq.js')
// await import('../scripts/@tryRating.js')
// await import('../scripts/tryRating_Search20.js');
