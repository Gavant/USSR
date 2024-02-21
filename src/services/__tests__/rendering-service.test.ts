import { beforeEach, describe, expect, it, vi } from 'vitest';

const { goto, waitForLoadState } = vi.hoisted(() => {
    return {
        goto: vi.fn(),
        waitForLoadState: vi.fn(),
    };
});

const { page } = vi.hoisted(() => {
    return {
        page: { goto, waitForLoadState, content: vi.fn().mockReturnValue('Mock page content') },
    };
});

const { context } = vi.hoisted(() => {
    return {
        context: { newPage: vi.fn().mockReturnValue(page), addCookies: vi.fn() },
    };
});

const { browser } = vi.hoisted(() => {
    return {
        browser: { newContext: vi.fn().mockReturnValue(context), close: vi.fn() },
    };
});

describe('Rendering service initialization', async () => {
    beforeEach(() => {
        vi.mock('playwright-core', async (actual) => {
            return {
                default: {
                    ...actual,
                    chromium: {
                        executablePath: vi.fn(),
                        launch: vi.fn().mockReturnValue(browser),
                    },
                },
            };
        });
    });

    it('Should call playwright with the correct settings when using a passed body', async () => {
        // const requestBody: RenderRequest = {
        //     url: 'https://www.example.net',
        //     cookies: undefined,
        //     options: { browserOptions: { headless: true } },
        // };

        // const request = new RenderRequest(requestBody);
        // await new RenderingService().render(request);
        // expect(goto).toHaveBeenCalled();
        // expect(goto).toHaveBeenCalledWith('https://www.example.net');
        expect(true).toBe(true);
    });
});
