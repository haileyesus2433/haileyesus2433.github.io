<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatDate } from '#lib/dates.ts';

	let { data } = $props();
	const meta = $derived(data.meta);
</script>

<svelte:head>
	<title>{meta.title} · Haileyesus Ayanaw</title>
	<meta name="description" content={meta.summary} />
</svelte:head>

<article class="columns flow">
	<header class="flow">
		<p class="back"><a href={resolve('/notes')}>Notes</a></p>
		<h1>{meta.title}</h1>
		<p class="meta">
			<time datetime={meta.date}>{formatDate(meta.date)}</time>
			{#if meta.tags.length}
				<span>{meta.tags.join(', ')}</span>
			{/if}
		</p>
	</header>

	<data.component />
</article>

<style>
	.back {
		font-size: var(--step--1);
	}

	.back a::before {
		content: '← ';
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3xs) var(--space-s);
		color: var(--muted);
		font-size: var(--step--1);
	}
</style>
