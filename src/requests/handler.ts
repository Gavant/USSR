import { APIGatewayProxyEventV2 } from 'aws-lambda';

import RenderRequestAdapter from './adapter';
import RenderingService from '../services/rendering-service';
import RenderRequest from './request';

export default class RenderHtmlHandler {
    request: RenderRequest;

    constructor(event: APIGatewayProxyEventV2) {
        console.log('in RenderHtmlHandler');
        this.request = new RenderRequestAdapter(event).toHtmlGenerationRequest();
    }

    /**
     * handle request for HTML by generating it and returning it as string
     *
     * @return {*}
     * @memberof RenderHtmlHandler
     */
    async handleRequest() {
        return await new RenderingService().render(this.request);
    }
}
