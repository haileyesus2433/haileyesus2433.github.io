import type { NoteMeta, WorkMeta, WorkStatus } from './content.ts';

type Frontmatter = Record<string, unknown> | undefined;

// Server-only, so reading every file's frontmatter here never pulls
// the content bodies into client JS.
const workMeta = import.meta.glob<Frontmatter>('/src/content/work/*.md', {
	eager: true,
	import: 'metadata'
});
const noteMeta = import.meta.glob<Frontmatter>('/src/content/notes/*.md', {
	eager: true,
	import: 'metadata'
});

const WORK_STATUSES: readonly WorkStatus[] = ['shipped', 'in progress', 'coursework'];

function slugOf(path: string): string {
	return path.slice(path.lastIndexOf('/') + 1, -'.md'.length);
}

// Frontmatter is checked at build time, so a bad file fails the build
// instead of rendering a half-empty page.
function fail(path: string, field: string, expected: string): never {
	throw new Error(`${path}: frontmatter field "${field}" must be ${expected}`);
}

function str(m: Record<string, unknown>, path: string, field: string): string {
	const v = m[field];
	if (typeof v !== 'string' || v.trim() === '') fail(path, field, 'a non-empty string');
	return v;
}

function strList(m: Record<string, unknown>, path: string, field: string): string[] {
	const v = m[field];
	if (!Array.isArray(v) || !v.every((x) => typeof x === 'string')) {
		fail(path, field, 'a list of strings');
	}
	return v;
}

function parseWork(path: string, m: Record<string, unknown>): WorkMeta {
	const status = m.status;
	if (!WORK_STATUSES.includes(status as WorkStatus)) {
		fail(path, 'status', WORK_STATUSES.join(' | '));
	}
	if (typeof m.order !== 'number') fail(path, 'order', 'a number');
	const links = (m.links ?? {}) as Record<string, unknown>;
	for (const [key, url] of Object.entries(links)) {
		if (typeof url !== 'string' || !url.startsWith('https://')) {
			fail(path, `links.${key}`, 'an https:// URL');
		}
	}
	return {
		slug: slugOf(path),
		title: str(m, path, 'title'),
		summary: str(m, path, 'summary'),
		role: str(m, path, 'role'),
		stack: strList(m, path, 'stack'),
		status: status as WorkStatus,
		links: links as WorkMeta['links'],
		order: m.order
	};
}

function parseNote(path: string, m: Record<string, unknown>): NoteMeta {
	const date = str(m, path, 'date');
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(path, 'date', 'a YYYY-MM-DD date');
	return {
		slug: slugOf(path),
		title: str(m, path, 'title'),
		summary: str(m, path, 'summary'),
		date,
		tags: strList(m, path, 'tags')
	};
}

const work: WorkMeta[] = Object.entries(workMeta)
	.map(([path, m]) => parseWork(path, m ?? {}))
	.sort((a, b) => a.order - b.order);

const notes: NoteMeta[] = Object.entries(noteMeta)
	.map(([path, m]) => parseNote(path, m ?? {}))
	.sort((a, b) => b.date.localeCompare(a.date));

export function listWork(): WorkMeta[] {
	return work;
}

export function getWorkMeta(slug: string): WorkMeta | undefined {
	return work.find((m) => m.slug === slug);
}

export function listNotes(): NoteMeta[] {
	return notes;
}

export function getNoteMeta(slug: string): NoteMeta | undefined {
	return notes.find((m) => m.slug === slug);
}
