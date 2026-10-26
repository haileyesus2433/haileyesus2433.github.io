import { error } from '@sveltejs/kit';
import { getWorkMeta, listWork } from '#lib/content.server.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => listWork().map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	const meta = getWorkMeta(params.slug);
	if (!meta) error(404);
	return { meta };
};
