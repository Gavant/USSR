import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { describe, expect, it } from 'vitest';
import { ApiGatewayAdapter } from '~/main';

describe('Cloudfront Adapter Functionality', async () => {
    it('Passing cloudfront event gives us the correct request', async () => {
        const event = {
            version: '2.0',
            routeKey: '$default',
            rawPath: '/my/path',
            rawQueryString: 'parameter1=value1&parameter1=value2&parameter2=value',
            cookies: ['USER_TOKEN=Yes', 'OTHER_TOKEN=Maybe'],
            headers: {
                header1: 'value1',
                header2: 'value1,value2',
            },
            queryStringParameters: {
                parameter1: 'value1,value2',
                parameter2: 'value',
            },
            requestContext: {
                accountId: '123456789012',
                apiId: 'api-id',
                authentication: {
                    clientCert: {
                        clientCertPem: 'CERT_CONTENT',
                        subjectDN: 'www.example.com',
                        issuerDN: 'Example issuer',
                        serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
                        validity: {
                            notBefore: 'May 28 12:30:02 2019 GMT',
                            notAfter: 'Aug  5 09:36:04 2021 GMT',
                        },
                    },
                },
                authorizer: {
                    jwt: {
                        claims: {
                            claim1: 'value1',
                            claim2: 'value2',
                        },
                        scopes: ['scope1', 'scope2'],
                    },
                },
                domainName: 'id.execute-api.us-east-1.amazonaws.com',
                domainPrefix: 'id',
                http: {
                    method: 'POST',
                    path: '/my/path',
                    protocol: 'HTTP/1.1',
                    sourceIp: '192.0.2.1',
                    userAgent: 'agent',
                },
                requestId: 'id',
                routeKey: '$default',
                stage: '$default',
                time: '12/Mar/2020:19:03:58 +0000',
                timeEpoch: 1583348638390,
            },
            body: '{"url":"https://test.com","headers":{"header1":"value1","header2":"value1,value2"},"cookies":["USER_TOKEN=YES"]}',
            pathParameters: {
                parameter1: 'value1',
            },
            isBase64Encoded: false,
            stageVariables: {
                stageVariable1: 'value1',
                stageVariable2: 'value2',
            },
        };

        const request = new ApiGatewayAdapter().toHtmlGenerationRequest(event);

        expect(request).toBeDefined();
        expect(request.url).toBe('https://test.com');
        expect(request.cookies).toEqual([
            {
                key: 'USER_TOKEN',
                value: 'YES',
            },
        ]);

        expect(request.options).toEqual(undefined);
        expect(request.headers).toEqual({ header1: 'value1', header2: 'value1,value2' });
    });
});
