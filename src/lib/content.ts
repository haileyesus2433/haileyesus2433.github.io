import type { Component } from 'svelte';

export type WorkStatus = 'shipped' | 'in progress' | 'coursework';

export interface WorkMeta {
	slug: string;
	title: string;
	summary: string;
	role: string;
	stack: string[];
	status: WorkStatus;
	links: { code?: string; pr?: string; demo?: string };
	order: number;
}

export interface NoteMeta {
	slug: string;
	title: string;
	summary: string;
	date: string;
	tags: string[];
}

type Body = () => Promise<{ default: Component }>;

// Bodies are lazy so each page's JS holds only its own content.
const workBodies = import.meta.glob<{ default: Component }>('/src/content/work/*.md');
const noteBodies = import.meta.glob<{ default: Component }>('/src/content/notes/*.md');

async function loadBody(bodies: Record<string, Body>, dir: string, slug: string) {
	const body = bodies[`/src/content/${dir}/${slug}.md`];
	if (!body) throw new Error(`No content file for ${dir}/${slug}`);
	return (await body()).default;
}

export function loadWorkBody(slug: string): Promise<Component> {
	return loadBody(workBodies, 'work', slug);
}

export function loadNoteBody(slug: string): Promise<Component> {
	return loadBody(noteBodies, 'notes', slug);
}
