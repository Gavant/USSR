import { Cookie } from 'puppeteer-core';

export interface RenderRequestHeaders {
    [key: string]: string | undefined;
}

export interface BrowserOptions {
    headless: boolean;
}

export interface Options {
    browserOptions: BrowserOptions;
}

export type RenderRequestCookies = Cookie[];

export interface RenderRequestProps {
    url: string;
    cookies?: RenderRequestCookies;
    options?: Options;
    headers?: RenderRequestHeaders;
}

export default class RenderRequest implements RenderRequestProps {
    url: string;
    cookies?: RenderRequestCookies;
    options?: Options;
    headers?: RenderRequestHeaders;

    constructor(args: RenderRequestProps) {
        this.url = args.url;
        this.cookies = args.cookies;
        this.options = args.options;
        this.headers = args.headers ?? {};
    }
}
