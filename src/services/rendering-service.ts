
import puppeteer from 'puppeteer-core'
// import { IDLE_NETWORK } from '../constants/playwright.ts';
// import { LaunchOptions } from 'playwright';
import RenderRequest from './../requests/request';

const destinationUrl = (request: RenderRequest): string => {
    // Prioritize headers
    if (request.headers?.['x-prerender-host']) {
        if (request.headers?.['x-query-string']) {
            return `${request.headers['x-prerender-host']}${request.headers['x-query-string']}`
        }

        return request.headers['x-prerender-host']
    }

    return request.url
}

export default class RenderingService {
    async render(
        renderRequest: RenderRequest,
    ) {
        console.log("Launching Browser...");
        const browser = await this.launchBrowser();
        // const context = await browser.newContext();
        console.log("Creating a new page...");
        const page = await browser.newPage();
    
        //Allow JS.
        await page.setJavaScriptEnabled(true);

        console.log("Grabing url...");
        console.log(renderRequest);
        const url = destinationUrl(renderRequest)
        console.log(url);
        console.log("Going to url.");
        await page.goto(url, {
            waitUntil: 'networkidle0',
        });
        // await page.waitForLoadState(IDLE_NETWORK)
        console.log(`Puppeteer visited page located at ${url}`);
        const result = await page.content();
        await browser.close();
        return result;
    }

    async launchBrowser() {

       return await puppeteer.launch({
        args: ['--no-sandbox'],
        executablePath: '/usr/bin/google-chrome-stable',
      });
    }
}
