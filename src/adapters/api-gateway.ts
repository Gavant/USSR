import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import { Cookie } from 'puppeteer-core';
import BaseAdapter from '~/adapters/base.ts';
import RenderRequest from '~/requests/request.ts';

type ApiGatewayProxyEventV2CustomBody = {
    url: string;
    headers: Record<string, string>;
    cookies: string[];
};

export class ApiGatewayAdapter<B extends ApiGatewayProxyEventV2CustomBody, T extends APIGatewayProxyEventV2> extends BaseAdapter<T> {
    toHtmlGenerationRequest(event: T) {
        if (!event.body) {
            throw new Error('Event body is missing');
        }

        const body = JSON.parse(event.body) as B;
        const headers = body.headers;

        let url = body.url;

        // Take a string cookie and convert it to a cookie object
        const cookies = body.cookies?.map((cookie) => {
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
