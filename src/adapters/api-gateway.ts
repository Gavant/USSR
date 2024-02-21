import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import BaseAdapter from '~/adapters/base.ts';
import RenderRequest, { Options, RenderRequestCookies } from '~/requests/request.ts';

export interface RenderRequestBody {
    url: string;
    cookies?: RenderRequestCookies;
    options?: Options;
}

export interface RenderRequestHeaders {
    'x-prerender-host'?: string;
    'x-query-string'?: string;
}

export class ApiGatewayAdapter<T extends APIGatewayProxyEventV2> extends BaseAdapter<T> {
    destinationUrl(headers: RenderRequestHeaders, bodyUrl: string) {
        // Prioritize headers
        if (headers?.['x-prerender-host']) {
            if (headers?.['x-query-string']) {
                return `${headers['x-prerender-host']}${headers['x-query-string']}`;
            }

            return headers['x-prerender-host'];
        }

        return bodyUrl;
    }

    toHtmlGenerationRequest(event: APIGatewayProxyEventV2) {
        const requestBody = event.body as unknown as RenderRequestBody;
        const headers = event.headers;

        const url = this.destinationUrl(headers, requestBody.url);

        return new RenderRequest({
            url,
            cookies: requestBody.cookies,
            options: requestBody.options,
            headers,
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
