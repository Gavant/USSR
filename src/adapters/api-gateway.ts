import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import BaseAdapter from '~/adapters/base';
import RenderRequest, { Options, RenderRequestCookies } from '~/requests/request';

export interface RenderRequestBody {
    url: string;
    cookies?: RenderRequestCookies;
    options?: Options;
}

export interface RenderRequestHeaders {
    'x-prerender-host'?: string;
    'x-query-string'?: string;
}

export class ApiGatewayAdapter<T> extends BaseAdapter<T> {
    requestBody: RenderRequestBody;
    headers: RenderRequestHeaders;
    url: string;

    constructor(event: APIGatewayProxyEventV2) {
        super();
        this.requestBody = event.body as unknown as RenderRequestBody;
        this.headers = event.headers;

        const destinationUrl = (headers: RenderRequestHeaders, bodyUrl: string): string => {
            // Prioritize headers
            if (headers?.['x-prerender-host']) {
                if (headers?.['x-query-string']) {
                    return `${headers['x-prerender-host']}${headers['x-query-string']}`;
                }

                return headers['x-prerender-host'];
            }

            return bodyUrl;
        };

        this.url = destinationUrl(this.headers, this.requestBody.url);
    }

    toHtmlGenerationRequest() {
        return new RenderRequest({
            url: this.url,
            cookies: this.requestBody.cookies,
            options: this.requestBody.options,
            headers: this.headers,
        });
    }
}

const handler: Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2<{ url: string }>> = async (event) => {
    try {
        return ApiGatewayAdapter.handler(event);
    } catch (err) {
        console.log(err);
        return err as string;
    }
};

export default handler;
