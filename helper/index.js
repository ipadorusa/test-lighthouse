import fs from 'fs';

export const makeFolder = (dir) => {
    if(!fs.existsSync(dir)) fs.mkdirSync(dir);
}

export const dateFolderName = () => {
    const today = new Date();
    const year = today.getFullYear(),
        month = today.getMonth() + 1,
        day = today.getDate();
    return `${year}${month}${day}`
}

export const log = console.log;