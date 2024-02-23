import { executablePath } from 'puppeteer';
import puppeteer, { PuppeteerLaunchOptions } from 'puppeteer-core';
import { IDLE_NETWORK } from '~/constants/puppeteer';
import RenderRequest from '~/requests/request.ts';

export default class RenderingService {
    async render(renderRequest: RenderRequest) {
        const browser = await this.launchBrowser();
        console.log('Browser launched');
        const page = await browser.newPage();

        if (renderRequest.cookies) {
            await page.setCookie(...renderRequest.cookies);
            console.log('Cookies set');
        }

        await page.goto(renderRequest.url, {
            waitUntil: IDLE_NETWORK,
        });

        console.log(`Puppeteer visited page located at ${renderRequest.url}`);
        const result = await page.content();
        await browser.close();
        return result;
    }

    async launchBrowser() {
        const options = {
            args: process.env.BROWSER_ARGS?.split(',') ?? ['--no-sandbox'],
            executablePath: process?.env?.BROWSER_EXECUTABLE_PATH ? process?.env?.BROWSER_EXECUTABLE_PATH : executablePath(),
            headless: !!process?.env?.BROWSER_HEADLESS === false ? false : true,
        } as PuppeteerLaunchOptions;

        if (process?.env?.BROWSER_USER_DATA_DIR) {
            options.userDataDir = process?.env?.BROWSER_USER_DATA_DIR;
        }

        return await puppeteer.launch(options);
    }
}
