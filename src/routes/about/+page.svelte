<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { resolve } from '$app/paths';

	const history = [
		{
			role: 'Rust Developer (contract)',
			org: 'Gluu',
			dates: 'Jun 2025 to present',
			line: "Build Cedarling's batch authorization, language bindings, policy store security and developer tools in the Janssen Project."
		},
		{
			role: 'Lead Backend Developer',
			org: 'Decentral Technologies',
			dates: 'Oct 2024 to Oct 2025',
			line: 'Led the backend of a live buy-now-pay-later platform built in Rust on Axum, Tokio, SQLx and NATS.'
		},
		{
			role: 'Full Stack Developer',
			org: 'Openflow',
			dates: 'May 2024 to Oct 2024',
			line: 'Built Node.js APIs and moved server-to-server sync from REST to RabbitMQ and WebSockets.'
		}
	];
</script>

<Seo
	title="About · Haileyesus Ayanaw"
	description="Rust developer in Addis Ababa, working remotely. Work history, Turbin3, Cyfrin Updraft certificates and contact details."
/>

<div class="columns flow">
	<h1>About</h1>
	<p class="lead">
		I write Rust for backend systems and Solana programs, and I contribute to Cedarling in the
		Janssen Project. I'm looking for remote Rust backend and Solana work.
	</p>

	<section aria-labelledby="history-heading" class="flow">
		<h2 id="history-heading">Work history</h2>
		<ol class="history">
			{#each history as job (job.org)}
				<li>
					<h3>{job.role}, {job.org}</h3>
					<p class="dates">{job.dates}</p>
					<p>{job.line}</p>
				</li>
			{/each}
		</ol>
		<p><a href="/cv.pdf">Download my CV (PDF)</a></p>
	</section>

	<section aria-labelledby="training-heading" class="flow">
		<h2 id="training-heading">Training and education</h2>
		<ul class="plain">
			<li>
				Turbin3 graduate, Q3 2026 cohort. My capstone was the
				<a href={resolve('/work/[slug]', { slug: 'blockrouter' })}>BlockRouter MVP</a>.
			</li>
			<li>
				Cyfrin Updraft certificates in Advanced Foundry, Solidity Smart Contract Development,
				Foundry Fundamentals, Solana, Rust and Blockchain Basics.
				<a href="https://profiles.cyfrin.io/u/haileyesusbe/achievements">See the certificates</a>.
			</li>
			<li>BSc in Computer Engineering, Bahir Dar University, 2018 to 2023.</li>
		</ul>
	</section>

	<section aria-labelledby="contact-heading" class="flow">
		<h2 id="contact-heading">Contact</h2>
		<p>
			Email me at <a href="mailto:haileyesusbe@gmail.com">haileyesusbe@gmail.com</a>. I'm in Addis
			Ababa, UTC+3, and I speak English and Amharic.
		</p>
		<ul class="plain links">
			<li><a href="https://github.com/haileyesus2433">GitHub</a></li>
			<li><a href="https://linkedin.com/in/haileyesus-ayanaw">LinkedIn</a></li>
			<li><a href="https://crates.io/crates/dynarule">dynarule on crates.io</a></li>
		</ul>
	</section>
</div>

<style>
	.lead {
		color: var(--muted);
		font-size: var(--step-1);
	}

	section {
		margin-top: var(--space-2xl);
	}

	.history,
	.plain {
		display: grid;
		gap: var(--space-m);
		padding: 0;
		list-style: none;
	}

	.history li {
		padding-left: var(--space-s);
		border-left: 1px solid var(--rule);
	}

	.history h3 {
		font-size: var(--step-0);
	}

	.dates {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-m);
	}
</style>
