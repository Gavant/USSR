import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import { Cookie } from 'puppeteer-core';
import BaseAdapter from '~/adapters/base.ts';
import RenderRequest from '~/requests/request.ts';

export class ApiGatewayAdapter<T extends APIGatewayProxyEventV2> extends BaseAdapter<T> {
    toHtmlGenerationRequest(event: APIGatewayProxyEventV2) {
        const headers = event.headers;

        let url = `https://${event.requestContext.domainName}${event.rawPath}`;
        if (event.rawQueryString) {
            url += `?${event.rawQueryString}`;
        }
        // Take a string cookie and convert it to a cookie object
        const cookies = event.cookies?.map((cookie) => {
            const [key, value] = cookie.split('=');
            return { key, value } as unknown as Cookie;
        });

        return new RenderRequest({
            url,
            cookies,
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
