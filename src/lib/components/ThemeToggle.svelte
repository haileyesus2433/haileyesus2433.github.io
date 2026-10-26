<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark';

	let theme = $state<Theme>('light');

	function current(): Theme {
		const set = document.documentElement.dataset.theme;
		if (set === 'light' || set === 'dark') return set;
		return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	onMount(() => {
		theme = current();
	});

	function toggle() {
		theme = current() === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// Storage blocked: the choice lasts for this page only.
		}
	}
</script>

<!-- Hidden without JS, where the system theme applies. -->
<button type="button" class="theme-toggle" aria-pressed={theme === 'dark'} onclick={toggle}>
	<span class="visually-hidden">Dark theme</span>
	<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
		{#if theme === 'dark'}
			<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
		{:else}
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
			/>
		{/if}
	</svg>
</button>

<style>
	.theme-toggle {
		display: none;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		background: none;
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		color: var(--text);
		cursor: pointer;
	}

	:global(html.js) .theme-toggle {
		display: grid;
	}

	.theme-toggle:hover {
		border-color: var(--muted);
	}

	svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
