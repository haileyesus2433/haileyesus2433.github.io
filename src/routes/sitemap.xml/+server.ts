import { listNotes, listWork } from '#lib/content.server.ts';
import { absolute } from '#lib/site.ts';

export const prerender = true;

export function GET() {
	const paths = [
		'/',
		'/work',
		'/notes',
		'/about',
		...listWork().map((w) => `/work/${w.slug}`),
		...listNotes().map((n) => `/notes/${n.slug}`)
	];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${absolute(p)}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
