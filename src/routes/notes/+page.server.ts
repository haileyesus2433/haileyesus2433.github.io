import { listNotes } from '#lib/content.server.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ notes: listNotes() });
