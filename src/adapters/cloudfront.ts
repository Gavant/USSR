import { CloudFrontRequestEvent, Handler } from 'aws-lambda';
import BaseAdapter from '~/adapters/base';
import RenderRequest, { RenderRequestCookies } from '~/requests/request';

export class CloudfrontAdapter<T extends CloudFrontRequestEvent> extends BaseAdapter<T> {
    toHtmlGenerationRequest(event: T) {
        const request = event.Records[0].cf.request;
        const url = `https://${request.headers.host[0].value}${request.uri}`;

        const cookies = request.headers.cookie as RenderRequestCookies;

        const headers = request.headers;

        delete headers['cookie'];

        return new RenderRequest({
            url,
            cookies,
            headers,
        });
    }
}

const handler: Handler<CloudFrontRequestEvent, string> = async (event) => {
    try {
        return CloudfrontAdapter.handler(event);
    } catch (err) {
        console.log(err);
        return err as string;
    }
};

export default handler;
