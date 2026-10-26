import { WORK_GROUPS } from '#lib/content.ts';
import { listWork } from '#lib/content.server.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const work = listWork();
	return {
		groups: WORK_GROUPS.map((g) => ({ ...g, items: work.filter((w) => w.group === g.id) })).filter(
			(g) => g.items.length > 0
		)
	};
};
