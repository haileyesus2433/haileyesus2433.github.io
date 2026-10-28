import { loadNoteBody } from '#lib/content.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => ({
	meta: data.meta,
	component: await loadNoteBody(data.meta.slug)
});
