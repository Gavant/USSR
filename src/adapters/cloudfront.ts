import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
    CloudFrontHeaders,
    CloudFrontRequestEvent,
    Handler
} from 'aws-lambda';
import BaseAdapter from '~/adapters/base';
import RenderRequest, { Options, RenderRequestCookies } from '~/requests/request';

export class CloudfrontAdapter<T> extends BaseAdapter<T> {
    url: string;
    cookies: RenderRequestCookies;
    headers: CloudFrontHeaders;

    constructor(event: CloudFrontRequestEvent) {
        super();
        const request = event.Records[0].cf.request;
        this.url = `https://${request.headers.host[0].value}${request.uri}`;

        this.cookies = request.headers.cookie as RenderRequestCookies;

        this.headers = request.headers;
    }

    toHtmlGenerationRequest() {
        return new RenderRequest({
            url: this.url,
            cookies: this.cookies,
            headers: this.headers,
        });
    }
}

const handler: Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2<{ url: string }>> = async (event) => {
    try {
        return CloudfrontAdapter.handler(event);
    } catch (err) {
        console.log(err);
        return err as string;
    }
};

export default handler;
