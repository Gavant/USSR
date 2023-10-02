import { APIGatewayProxyEventV2 } from 'aws-lambda';

import RenderRequest from '~/requests/request';

export interface BrowserOptions {
    headless: boolean;
}

export interface Options {
    browserOptions: BrowserOptions
}

export interface RenderRequestBody {
    url: string;
    secure?: boolean;
    cookies?: {name: string, value: string}[];
    options?: Options
}

export interface RenderRequestHeaders {
    "x-prerender-host"?: string,
    "x-query-string"?: string
}

export default class RenderRequestAdapter {
    requestBody: RenderRequestBody;
    headers: RenderRequestHeaders;
    constructor(event: APIGatewayProxyEventV2) {
        this.requestBody = event.body as unknown as RenderRequestBody;
        this.headers = event.headers as unknown as RenderRequestHeaders;
    }

    toHtmlGenerationRequest() {
        return new RenderRequest({
            url: this.requestBody.url,
            secure: this.requestBody.secure,
            cookies: this.requestBody.cookies,
            options: this.requestBody.options,
        }, this.headers);
    }
}
