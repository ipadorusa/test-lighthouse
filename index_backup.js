import {writeFileSync} from 'fs';
import open from 'open';
import puppeteer from 'puppeteer';
import {startFlow} from 'lighthouse/lighthouse-core/fraggle-rock/api.js';
import config from 'lighthouse/lighthouse-core/config/desktop-config.js';

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  const flow = await startFlow(page, {config, name: 'Single Navigation'});
  await flow.navigate('https://www.saramin.co.kr/zf_user/');  
  await browser.close();
  console.log('report', flow.steps[0].lhr.accessibility)
  const report = flow.generateReport();
  //fs.writeFileSync('flow.report.html', report);
  writeFileSync('flow-result.json', JSON.stringify(flow.getFlowResult(), null, 2));
  
  //open('flow.report.html', {wait: false});
  
})();