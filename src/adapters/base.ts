import RenderRequest from '~/requests/request';
import RenderingService from '~/services/rendering-service';

export default interface BaseAdapter<T> {
    handler(event: T): Promise<string>;
    toHtmlGenerationRequest(event: T): RenderRequest;
}

export default class Base<T> implements BaseAdapter<T> {
    static async handler<T>(event: T) {
        const request = new this().toHtmlGenerationRequest(event);
        const rendered = await new RenderingService().render(request);
        return rendered;
    }

    toHtmlGenerationRequest(event: any): RenderRequest {
        throw new Error('Method not implemented.');
    }
}
