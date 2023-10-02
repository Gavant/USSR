import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';

import RenderHtmlHandler from './requests/handler';

type ProxyHandler<T> = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2<T>>;
export const handler: ProxyHandler<{ url: string }> = async (event) => {
    try {
        console.log(event);
        const requestHandler = await new RenderHtmlHandler(event).handleRequest();
        return requestHandler;
    } catch (err) {
        console.log(err);
        return err as string;
    }
};
