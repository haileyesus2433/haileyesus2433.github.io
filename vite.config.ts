import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import { defineConfig, loadEnv } from 'vite';

// Highlighting runs here, at build time. The output is static HTML with
// CSS variables for both themes, so no highlighter ships to the browser.
const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: ['rust', 'c', 'typescript', 'javascript', 'toml', 'yaml', 'json', 'bash', 'sql']
});

function highlight(code: string, lang: string | null | undefined): string {
	const html = highlighter.codeToHtml(code, {
		lang: lang && highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
		themes: { light: 'github-light', dark: 'github-dark' },
		defaultColor: false
	});
	return `{@html \`${escapeSvelte(html)}\`}`;
}

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
