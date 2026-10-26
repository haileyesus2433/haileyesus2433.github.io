<script lang="ts">
	import type { WorkStatus } from '#lib/content.ts';

	let { status }: { status: WorkStatus } = $props();

	const labels: Record<WorkStatus, string> = {
		shipped: 'Shipped',
		'in progress': 'In progress',
		coursework: 'Coursework'
	};
</script>

<span class="status">{labels[status]}</span>

<style>
	.status {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		letter-spacing: 0.02em;
	}
</style>
