import fs from 'fs';

function writeToFile(inf) {

    const now = new Date();
    const fileName = `z_${now.getTime()}.json`;
    fs.writeFileSync(fileName, inf);
    console.log('FILE OK')
}

export { writeToFile };

