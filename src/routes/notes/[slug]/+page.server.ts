import { error } from '@sveltejs/kit';
import { getNoteMeta, listNotes } from '#lib/content.server.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => listNotes().map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	const meta = getNoteMeta(params.slug);
	if (!meta) error(404);
	return { meta };
};
