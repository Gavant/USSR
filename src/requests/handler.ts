import { APIGatewayProxyEventV2 } from 'aws-lambda';

import RenderRequestAdapter from './adapter';
import RenderingService from '../services/rendering-service.ts';

export default class RenderHtmlHandler {
    request: any;

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
