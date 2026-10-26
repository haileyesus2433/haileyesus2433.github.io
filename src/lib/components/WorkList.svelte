<script lang="ts">
	import { resolve } from '$app/paths';
	import type { WorkMeta } from '#lib/content.ts';
	import StatusLabel from './StatusLabel.svelte';

	let { items, headingLevel = 3 }: { items: WorkMeta[]; headingLevel?: 2 | 3 } = $props();
</script>

<ul class="work-list">
	{#each items as item (item.slug)}
		<li>
			<svelte:element this={`h${headingLevel}`} class="title">
				<a href={resolve('/work/[slug]', { slug: item.slug })}>{item.title}</a>
			</svelte:element>
			<p>{item.summary}</p>
			<p class="meta">
				<span>{item.stack.join(', ')}</span>
				<StatusLabel status={item.status} />
			</p>
		</li>
	{/each}
</ul>

<style>
	.work-list {
		display: grid;
		gap: var(--space-l);
		margin-top: var(--space-m);
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		gap: var(--space-3xs);
		padding-left: var(--space-s);
		border-left: 1px solid var(--rule);
	}

	li:hover,
	li:focus-within {
		border-left-color: var(--accent);
	}

	.title {
		font-size: var(--step-1);
		font-weight: 600;
	}

	.title a {
		color: var(--text);
		text-decoration-color: var(--accent);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3xs) var(--space-s);
		color: var(--muted);
		font-size: var(--step--1);
	}
</style>
