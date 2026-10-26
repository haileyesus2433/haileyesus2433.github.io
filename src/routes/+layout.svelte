<script lang="ts">
	import '#lib/styles/tokens.css';
	import '#lib/styles/base.css';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';

	let { children } = $props();

	const nav = [
		{ href: '/work', label: 'Work' },
		{ href: '/notes', label: 'Notes' },
		{ href: '/about', label: 'About' }
	] as const;

	function isCurrent(href: (typeof nav)[number]['href']): boolean {
		const path = page.url.pathname;
		return path === resolve(href) || path.startsWith(resolve(href) + '/');
	}
</script>

<a class="skip-link" href="#main">Skip to content</a>

<header class="site-header page">
	<a class="name" href={resolve('/')}>Haileyesus Ayanaw</a>
	<nav aria-label="Main">
		<ul>
			{#each nav as item (item.href)}
				<li>
					<a href={resolve(item.href)} aria-current={isCurrent(item.href) ? 'page' : undefined}
						>{item.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
	<ThemeToggle />
</header>

<main id="main" class="page" tabindex="-1">
	{@render children()}
</main>

<footer class="site-footer page">
	<ul>
		<li><a href="mailto:haileyesusbe@gmail.com">haileyesusbe@gmail.com</a></li>
		<li><a href="https://github.com/haileyesus2433">GitHub</a></li>
		<li><a href="https://linkedin.com/in/haileyesus-ayanaw">LinkedIn</a></li>
	</ul>
</footer>

<style>
	.site-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs) var(--space-l);
		padding-block: var(--space-m);
	}

	.name {
		margin-right: auto;
		color: var(--text);
		font-weight: 600;
		text-decoration: none;
	}

	nav ul,
	.site-footer ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-m);
		padding: 0;
		list-style: none;
	}

	nav a {
		color: var(--muted);
		text-decoration: none;
	}

	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--text);
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-decoration-thickness: 2px;
	}

	main {
		padding-block: var(--space-xl) var(--space-2xl);
	}

	main:focus {
		outline: none;
	}

	.site-footer {
		padding-block: 0 var(--space-xl);
		font-size: var(--step--1);
	}

	.site-footer ul {
		padding-top: var(--space-l);
		border-top: 1px solid var(--rule);
	}
</style>
