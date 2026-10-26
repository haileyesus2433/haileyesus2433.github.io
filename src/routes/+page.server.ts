import { listFeaturedWork } from '#lib/content.server.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ featured: listFeaturedWork() });
