// The one place the public address lives. Canonical URLs, Open Graph, the
// sitemap and robots.txt all build on it.
export const SITE = {
	url: 'https://haileyesus2433.github.io',
	name: 'Haileyesus Ayanaw',
	jobTitle: 'Rust developer',
	email: 'haileyesusbe@gmail.com',
	sameAs: ['https://github.com/haileyesus2433', 'https://linkedin.com/in/haileyesus-ayanaw'],
	ogImage: '/og.png',
	ogImageAlt: 'Haileyesus Ayanaw, Rust developer. Backend systems and blockchain.'
} as const;

export function absolute(path: string): string {
	return SITE.url + (path === '/' ? '/' : path.replace(/\/$/, ''));
}
