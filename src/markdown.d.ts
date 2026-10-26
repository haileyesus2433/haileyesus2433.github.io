// Kept out of app.d.ts: a wildcard module must be declared in a file with no exports.
declare module '*.md' {
	import type { Component } from 'svelte';
	const component: Component;
	export default component;
	export const metadata: Record<string, unknown>;
}
