<script lang="ts">
	import { page } from '$app/state';
	import { SITE, absolute } from '#lib/site.ts';

	let {
		title,
		description,
		type = 'website'
	}: { title: string; description: string; type?: 'website' | 'article' } = $props();

	const url = $derived(absolute(page.url.pathname));
	const image = absolute(SITE.ogImage);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={SITE.ogImageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={SITE.ogImageAlt} />
</svelte:head>
