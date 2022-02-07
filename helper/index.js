import fs from 'fs';

export const makeFolder = (dir) => {
  if(!fs.existsSync(dir)) fs.mkdirSync(dir);
}

export const dateFolderGen = () => {
	const today = new Date();
	const year = today.getFullYear(),
		month = today.getMonth() + 1,
		day = today.getDate();
	return `${year}${month}${day}`
}

export const deleteFolder = (dir) => {
	try {
		fs.rmdirSync(dir, { recursive: true });
		console.log(`${dir} is deleted!`);
	} catch (e) {
		console.error(`Error while deleting ${dir}.`);
	}
}
export const log = console.log;