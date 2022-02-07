 import fs from 'fs';
import path from 'path';
import chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse'
import request from 'request';
import { fileURLToPath } from 'url';
import util from 'util';
import config from 'lighthouse/lighthouse-core/config/desktop-config.js';
import { makeFolder, dateFolderGen, deleteFolder, log } from './helper/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


(async() => {  
  let sites = [];
  let scoreArray = [];
  async function sitesInfo() {
    try {
      const contents = fs.readFileSync('site.txt', 'utf-8');
      sites = contents.trim().split("\n");
    }catch(e) {
      log('error',e);
    }    
    return sites;
  }

  async function asyncStringify(str) {
    return JSON.stringify(str,null, 2);
  }

  async function generateReport(url,idx, dirNameDay) {
    
    
    const domain = `list${idx}`;
    const opts = {
      chromeFlags: ['--headless'],
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['accessibility'] //accessibility 만 체크할때
    };
    
    // Launch chrome using chrome-launcher.
    const chrome = await chromeLauncher.launch(opts);
    opts.port = chrome.port;
    
    // Connect to it using puppeteer.connect().
    const resp = await util.promisify(request)(`http://localhost:${opts.port}/json/version`);
    const {webSocketDebuggerUrl} = JSON.parse(resp.body);
    const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});
    
    // Run Lighthouse.
    const {lhr}  = await lighthouse(url, opts, config);
    const reportScore = Object.values(lhr.categories).map(c => {
      scoreArray.push({url: url, score: c.score});
      return {url: url, id: c.id, score: c.score};
    });
    
    fs.writeFileSync(`${__dirname}/report/${dirNameDay}/${domain}.json`, JSON.stringify(reportScore, null, 2));
    await browser.disconnect();
    await chrome.kill();
  }  
  
  async function main() {
    const dirNameDay = dateFolderGen();

    deleteFolder(`${__dirname}/report/${dirNameDay}`);
    makeFolder(`${__dirname}/report/${dirNameDay}`);
    
    const tasks = await sitesInfo();
    let idx = 0;
    for(const task of tasks) {      
      await generateReport(task, idx, dirNameDay);
      idx++;
    }
    fs.writeFileSync(`${__dirname}/report/${dirNameDay}/scoreArray.json`, JSON.stringify(scoreArray, null, 2));
  }
  main();

})();