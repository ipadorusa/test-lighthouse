import fs from 'fs';


/**
 * makeFolder는 디렉토리 만들때 사용
 * @param {String} dir 
 */
export const makeFolder = (dir) => {
  if(!fs.existsSync(dir)) fs.mkdirSync(dir);
}

/**
 * dateFolderGen 날짜 폴더 생성을 위해 날짜계산
 * @returns {String}
 */
export const dateFolderGen = () => {
	const today = new Date();
	const year = today.getFullYear(),
		month = today.getMonth() + 1,
		day = today.getDate();
	return `${year}${month}${day}`
}

/**
 * deleteFolder 폴더 삭제
 * @param {String} dir 
 */

export const deleteFolder = (dir) => {
	try {
		fs.rmdirSync(dir, { recursive: true });
		console.log(`${dir} is deleted!`);
	} catch (e) {
		console.error(`Error while deleting ${dir}.`);
	}
}

/**
 * log찍기 편하게 위해서
 */
export const log = console.log;