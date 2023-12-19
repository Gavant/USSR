
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium';
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
        const browser = await this.launchBrowser();
        // const context = await browser.newContext();
        const page = await browser.newPage();

        // if (renderRequest.cookies) {
        //     await context.addCookies(renderRequest.cookies)
        //     console.log('Cookies set');
        // }

        const url = destinationUrl(renderRequest)
        await page.goto(url);
        // await page.waitForLoadState(IDLE_NETWORK)
        console.log(`Puppeteer visited page located at ${url}`);
        const result = await page.content();
        await browser.close();
        return result;
    }

    async launchBrowser() {

       return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: '/usr/bin/chromium', //await chromium.executablePath(),
        headless: chromium.headless,
      });
    }
}
