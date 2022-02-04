import fs from 'fs';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import {startFlow} from 'lighthouse/lighthouse-core/fraggle-rock/api.js';
import config from 'lighthouse/lighthouse-core/config/desktop-config.js';
const log = console.log;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



(async () => {
  let sites = [];
  function sitesInfo() {
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
  

  async function generateReport(url, idx) {
    /* const fileName = url.trim();
    const regFlag = /(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi;
    const domain = fileName.replace(fileName.match(regFlag),''); */
    const domain = `list${idx}`;
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const flow = await startFlow(page, {config});
    await flow.navigate(url);  
    await browser.close();    
    const report = flow.generateReport();
    const strJson = await asyncStringify(flow.getFlowResult());
    log(strJson.steps[0].lhr.categories.accessibility)
    //log(jsonData.steps[0].lhr.categories.accessibility)
    //const scores = jsonData.steps[0].lhr.categories.accessibility.score;
   
    //fs.writeFileSync(`${__dirname}/report/${domain}.json`, JSON.stringify(flow.getFlowResult(), null, 2));
  }

  let list = await sitesInfo();  
  list.map((val,idx) => generateReport(val, idx));

})();

