import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig, loadEnv } from 'vite';
import { highlight } from './highlight.ts';

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit({
			adapter: adapter({ strict: true }),
			extensions: ['.svelte', '.md'],
			preprocess: [mdsvex({ extensions: ['.md'], highlight: { highlighter: highlight } })],
			paths: {
				// Empty for a root deploy. Set BASE_PATH=/portfolio to serve from a subpath.
				base: (loadEnv(mode, '.', 'BASE_').BASE_PATH ?? '') as '' | `/${string}`
			}
		})
	]
}));
