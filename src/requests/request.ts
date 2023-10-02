
import { Options, RenderRequestBody, RenderRequestHeaders } from './adapter';

export default class RenderRequest {
    url: string;
    secure: boolean;
    cookies?: {name: string, value: string}[];
    options?: Options
    headers?: RenderRequestHeaders


    constructor(...args: [RenderRequestBody, RenderRequestHeaders?]) {
        this.url = args?.[0]?.url;
        this.secure = args?.[0]?.secure ?? true;
        this.cookies = args?.[0]?.cookies;
        this.options = args?.[0].options
        this.headers = args?.[1] ?? {}
    }
}
