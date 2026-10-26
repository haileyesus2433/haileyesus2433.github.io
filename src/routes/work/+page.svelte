<script lang="ts">
	import WorkList from '#lib/components/WorkList.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Work · Haileyesus Ayanaw</title>
	<meta
		name="description"
		content="Case studies: Cedarling open-source contributions, Solana programs, Rust crates and coursework."
	/>
</svelte:head>

<div class="columns flow">
	<h1>Work</h1>
	<p class="lead">
		Each case study covers the problem, what I built, one decision and its cost, and a real excerpt
		from the code.
	</p>

	{#each data.groups as group (group.id)}
		<section aria-labelledby="group-{group.id}">
			<h2 id="group-{group.id}">{group.label}</h2>
			<WorkList items={group.items} />
		</section>
	{/each}
</div>

<style>
	.lead {
		color: var(--muted);
		font-size: var(--step-1);
	}

	section {
		margin-top: var(--space-2xl);
	}
</style>
