<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { resolve } from '$app/paths';
	import { formatDate } from '#lib/dates.ts';

	let { data } = $props();
</script>

<Seo
	title="Notes · Haileyesus Ayanaw"
	description="Short technical notes from my own Rust and Solana work, each built around one real code example."
/>

<div class="columns flow">
	<h1>Notes</h1>
	<p class="lead">Short write-ups of one idea each, taken from code I've worked on.</p>

	{#if data.notes.length}
		<ul class="note-list">
			{#each data.notes as note (note.slug)}
				<li>
					<h2><a href={resolve('/notes/[slug]', { slug: note.slug })}>{note.title}</a></h2>
					<p>{note.summary}</p>
					<p class="meta"><time datetime={note.date}>{formatDate(note.date)}</time></p>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No notes yet.</p>
	{/if}
</div>

<style>
	.lead {
		color: var(--muted);
		font-size: var(--step-1);
	}

	.note-list {
		display: grid;
		gap: var(--space-l);
		margin-top: var(--space-xl);
		padding: 0;
		list-style: none;
	}

	.note-list li {
		display: grid;
		gap: var(--space-3xs);
		padding-left: var(--space-s);
		border-left: 1px solid var(--rule);
	}

	.note-list li:hover,
	.note-list li:focus-within {
		border-left-color: var(--accent);
	}

	h2 {
		font-size: var(--step-1);
	}

	h2 a {
		color: var(--text);
		text-decoration-color: var(--accent);
	}

	.meta {
		color: var(--muted);
		font-size: var(--step--1);
	}
</style>
