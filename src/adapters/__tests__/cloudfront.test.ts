import { CloudFrontRequestEvent } from 'aws-lambda';
import { describe, expect, it } from 'vitest';
import { CloudfrontAdapter } from '~/adapters/cloudfront';

describe('Cloudfront Adapter Functionality', async () => {
    it('Passing cloudfront event gives us the correct request', async () => {
        const event = {
            Records: [
                {
                    cf: {
                        config: {
                            distributionDomainName: 'exampleDomainName.cloudfront.net',
                            distributionId: 'exampleDistributionID',
                            eventType: 'origin-request',
                            requestId: '123',
                        },
                        request: {
                            clientIp: 'exampleIp',
                            headers: {
                                cookie: [
                                    {
                                        key: 'Cookie',
                                        value: 'exampleCookie',
                                    },
                                ],
                                host: [
                                    {
                                        key: 'Host',
                                        value: 'exampleHost',
                                    },
                                ],
                                'user-agent': [
                                    {
                                        key: 'User-Agent',
                                        value: 'curl/7.66.0',
                                    },
                                ],
                                accept: [
                                    {
                                        key: 'accept',
                                        value: '*/*',
                                    },
                                ],
                            },
                            method: 'GET',
                            querystring: '',
                            uri: '/posts',
                        },
                    },
                },
            ],
        } as CloudFrontRequestEvent;

        const request = new CloudfrontAdapter().toHtmlGenerationRequest(event);

        expect(request).toBeDefined();
        expect(request.url).toBe('https://exampleHost/posts');
        expect(request.cookies).toEqual([{ key: 'Cookie', value: 'exampleCookie' }]);
        expect(request.options).toEqual(undefined);
        expect(request.headers).toEqual({
            host: [
                {
                    key: 'Host',
                    value: 'exampleHost',
                },
            ],
            cookie: [
                {
                    key: 'Cookie',
                    value: 'exampleCookie',
                },
            ],
            'user-agent': [
                {
                    key: 'User-Agent',
                    value: 'curl/7.66.0',
                },
            ],
            accept: [
                {
                    key: 'accept',
                    value: '*/*',
                },
            ],
        });
    });
});
