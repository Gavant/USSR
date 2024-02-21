import path from 'node:path';
import { resolve } from 'path';

/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            '~': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: [resolve(__dirname, './src/main.ts')],
            name: 'u-ssr',
            fileName: (format, entryName) => {
                return `${entryName}.${format === 'es' ? 'js' : 'cjs'}`;
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
