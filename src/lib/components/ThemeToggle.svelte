<!-- Static markup. The inline script at the end of app.html wires it up and
     keeps aria-pressed in sync. Hidden without JS, where the system theme applies. -->
<button type="button" class="theme-toggle" id="theme-toggle" aria-pressed="false">
	<span class="visually-hidden">Dark theme</span>
	<svg class="icon-sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
		<circle cx="12" cy="12" r="4" />
		<path
			d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
		/>
	</svg>
	<svg class="icon-moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
		<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
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

	/* The icon follows the effective theme, so it is right before any script runs. */
	.icon-moon {
		display: none;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light'])) .icon-sun {
			display: none;
		}
		:global(:root:not([data-theme='light'])) .icon-moon {
			display: block;
		}
	}

	:global(:root[data-theme='dark']) .icon-sun {
		display: none;
	}

	:global(:root[data-theme='dark']) .icon-moon {
		display: block;
	}

	:global(:root[data-theme='light']) .icon-moon {
		display: none;
	}

	:global(:root[data-theme='light']) .icon-sun {
		display: block;
	}
</style>
