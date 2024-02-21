import { describe, expect, it } from 'vitest';
import BaseAdapter from '~/adapters/base.ts';

class ExtendedAdapter extends BaseAdapter<unknown> {}

describe('Base Adapter', async () => {
    it('Trying to use base class static property should throw an error', async () => {
        const event = {};
        await expect(BaseAdapter.handler(event)).rejects.toThrowError('Method not implemented.');
    });

    it('Extending base class without implementing `toHtmlGenerationRequest` should throw error', async () => {
        const event = {};
        expect(() => new ExtendedAdapter().toHtmlGenerationRequest(event)).toThrowError('Method not implemented.');
    });
});
