import chromium from 'chrome-aws-lambda';
import { LaunchOptions } from 'playwright';
import playwright from 'playwright-core';
import RenderRequest from '~/requests/request';

import { IDLE_NETWORK } from '../constants/playwright';

export default class RenderingService {
    async render(renderRequest: RenderRequest) {
        const browser = await this.launchBrowser();
        const context = await browser.newContext();
        const page = await context.newPage();

        if (renderRequest.cookies) {
            await context.addCookies(renderRequest.cookies);
            console.log('Cookies set');
        }

        await page.goto(renderRequest.url);
        await page.waitForLoadState(IDLE_NETWORK);
        console.log(`Playwright visited page located at ${renderRequest.url}`);
        const result = await page.content();
        await browser.close();
        return result;
    }

    async launchBrowser() {
        const options: LaunchOptions = {
            args: chromium.args,
            executablePath: process?.env?.AWS_EXECUTION_ENV ? await chromium.executablePath : playwright.chromium.executablePath(),
            headless: chromium.headless,
            devtools: false,
        };

        return await playwright.chromium.launch(options);
    }
}
