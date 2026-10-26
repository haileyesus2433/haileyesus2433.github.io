import { loadWorkBody } from '#lib/content.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => ({
	meta: data.meta,
	component: await loadWorkBody(data.meta.slug)
});
