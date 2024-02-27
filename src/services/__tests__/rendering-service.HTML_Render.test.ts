import { describe, expect, it } from 'vitest';
import RenderRequest, { RenderRequestCookies, RenderRequestHeaders } from '~/requests/request.ts';
import { HTMLResult } from '~/services/__tests__/result-html.ts';
import RenderingService from '~/services/rendering-service.ts';

// Not quite a unit test. But wanted actual HTML rendering included in here.
describe('A full rendering request', () => {
    it('Should return rendered HTML set via the body', async () => {
        const url = 'https://www.example.com';
        const cookies: RenderRequestCookies = [];
        const options = {
            browserOptions: {
                headless: true,
            },
        };
        const request = new RenderRequest({
            url,
            cookies,
            options,
            headers: {} as RenderRequestHeaders,
        });
        const HTML = await new RenderingService().render(request);
        expect(HTML).toBeDefined();
        expect(HTML).toContain('<!DOCTYPE html><html');
        expect(HTML).toContain('</body></html>');
        expect(HTML).toMatch(HTMLResult);
    }, 60000);
});
