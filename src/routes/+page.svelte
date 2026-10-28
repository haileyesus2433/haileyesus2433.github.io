<script lang="ts">
	import { resolve } from '$app/paths';
	import WorkList from '#lib/components/WorkList.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Haileyesus Ayanaw · Rust developer</title>
	<meta
		name="description"
		content="Rust developer. Authorization engine features in Cedarling, Solana programs and backend services, with case studies and real code."
	/>
</svelte:head>

<div class="columns flow">
	<header class="intro flow">
		<h1>Haileyesus Ayanaw</h1>
		<p class="role">Rust developer. Backend systems and blockchain.</p>
		<p>
			I write Rust for backend services and Solana programs. Right now I contribute to Cedarling,
			the authorization engine of the Janssen Project.
		</p>
	</header>

	<section aria-labelledby="work-heading">
		<h2 id="work-heading">Selected work</h2>
		<WorkList items={data.featured} />
		<p class="more"><a href={resolve('/work')}>All work</a></p>
	</section>

	<section aria-labelledby="now-heading" class="flow">
		<h2 id="now-heading">Now</h2>
		<ul class="now-list">
			<li>
				Contributing to Cedarling. My most recent PR added format versioning to the policy store.
			</li>
			<li>BlockRouter's MVP is done. It was my Turbin3 capstone.</li>
			<li>Open to remote Rust backend and Solana work.</li>
		</ul>
	</section>

	<section aria-labelledby="contact-heading" class="flow">
		<h2 id="contact-heading">Contact</h2>
		<p>
			Email me at <a href="mailto:haileyesusbe@gmail.com">haileyesusbe@gmail.com</a>. I work
			remotely from Addis Ababa, UTC+3.
		</p>
	</section>
</div>

<style>
	.role {
		color: var(--muted);
		font-size: var(--step-1);
	}

	.intro {
		margin-bottom: var(--space-xl);
	}

	section + section {
		margin-top: var(--space-2xl);
	}

	.more {
		margin-top: var(--space-m);
	}

	.now-list {
		display: grid;
		gap: var(--space-2xs);
		padding-left: 1.25em;
	}
</style>
