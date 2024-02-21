import RenderRequest from '~/requests/request.ts';
import RenderingService from '~/services/rendering-service.ts';

export default interface BaseAdapterInterface<T> {
    handler(event: T): Promise<string>;
    toHtmlGenerationRequest(event: T): RenderRequest;
}

export default class BaseAdapter<T> implements BaseAdapterInterface<T> {
    static async handler<T>(event: T) {
        const request = new this().toHtmlGenerationRequest(event);
        const rendered = await new RenderingService().render(request);
        return rendered;
    }

    toHtmlGenerationRequest(_event: any): RenderRequest {
        throw new Error('Method not implemented.');
    }
}
