import { executablePath } from 'puppeteer';
import puppeteer, { PuppeteerLaunchOptions } from 'puppeteer-core';
import { IDLE_NETWORK } from '~/constants/puppeteer';
import RenderRequest from '~/requests/request.ts';

import chromium from '@sparticuz/chromium';

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
        const chromiumPath = import.meta.env.DEV ? await chromium.executablePath : executablePath();
        const options = {
            args: process.env.BROWSER_ARGS?.split(',') ?? ['--no-sandbox'],
            executablePath: chromiumPath,
            headless: !!process?.env?.BROWSER_HEADLESS === false ? false : true,
        } as PuppeteerLaunchOptions;

        if (process?.env?.BROWSER_USER_DATA_DIR) {
            options.userDataDir = process?.env?.BROWSER_USER_DATA_DIR;
        }

        return await puppeteer.launch(options);
    }
}
