
import { Options, RenderRequestBody } from './adapter';

export default class RenderRequest {
    url: string;
    secure: boolean;
    cookies?: {name: string, value: string}[];
    options?: Options


    constructor(args: RenderRequestBody) {
        this.url = args.url;
        this.secure = args.secure ?? true;
        this.cookies = args.cookies;
        this.options = args.options
    }
}
