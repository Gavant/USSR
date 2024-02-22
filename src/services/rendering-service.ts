import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-core';
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
        return await puppeteer.launch({
            args: ['--no-sandbox'],
            executablePath: process?.env?.BROWSER_EXECUTABLE_PATH ? process?.env?.BROWSER_EXECUTABLE_PATH : executablePath(),
            headless: !!process?.env?.BROWSER_HEADLESS ?? true,
            userDataDir: process?.env?.BROWSER_USER_DATA_DIR ?? '/tmp',
        });
    }
}
