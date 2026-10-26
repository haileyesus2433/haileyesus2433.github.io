<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusLabel from '#lib/components/StatusLabel.svelte';

	let { data } = $props();
	const meta = $derived(data.meta);

	const linkLabels = { code: 'Code', pr: 'Pull requests', demo: 'Live demo', crate: 'crates.io' };
	const links = $derived(
		(Object.keys(linkLabels) as (keyof typeof linkLabels)[])
			.filter((k) => meta.links[k])
			.map((k) => ({ label: linkLabels[k], href: meta.links[k]! }))
	);
</script>

<svelte:head>
	<title>{meta.title} · Haileyesus Ayanaw</title>
	<meta name="description" content={meta.summary} />
</svelte:head>

<article class="columns flow case-study">
	<header class="flow">
		<p class="back"><a href={resolve('/work')}>Work</a></p>
		<h1>{meta.title}</h1>
		<p class="lead">{meta.summary}</p>
		<dl class="spec">
			<div>
				<dt>Role</dt>
				<dd>{meta.role}</dd>
			</div>
			<div>
				<dt>Stack</dt>
				<dd>{meta.stack.join(', ')}</dd>
			</div>
			<div>
				<dt>Status</dt>
				<dd><StatusLabel status={meta.status} /></dd>
			</div>
			{#if links.length}
				<div>
					<dt>Links</dt>
					<dd>
						<ul class="links">
							{#each links as link (link.href)}
								<li><a href={link.href}>{link.label}</a></li>
							{/each}
						</ul>
					</dd>
				</div>
			{/if}
		</dl>
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

	.lead {
		color: var(--muted);
		font-size: var(--step-1);
	}

	.spec {
		display: grid;
		gap: var(--space-2xs);
		margin: var(--space-m) 0 0;
		padding-block: var(--space-s);
		border-block: 1px solid var(--rule);
		font-size: var(--step--1);
	}

	.spec div {
		display: grid;
		grid-template-columns: 6rem minmax(0, 1fr);
		gap: var(--space-s);
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3xs) var(--space-s);
		padding: 0;
		list-style: none;
	}
</style>
