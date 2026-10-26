<script lang="ts">
	import Excerpt from '#lib/placeholder/archive-excerpt.md';
</script>

<svelte:head>
	<title>Haileyesus Ayanaw, Rust developer</title>
	<meta name="description" content="Placeholder home page." />
</svelte:head>

<div class="columns flow">
	<h1>Placeholder heading for the home page</h1>
	<p>
		Placeholder intro paragraph. It sits in a 65 character column so you can judge the reading
		width, the body face and the <a href="/work">link style</a>. Inline code looks like
		<code>take(limit + 1)</code>.
	</p>
	<h2>Placeholder section heading</h2>
	<p class="muted">Muted text, used for captions and secondary lines.</p>
	<figure class="wide">
		<Excerpt />
		<figcaption>
			Real excerpt for checking code styling:
			<a
				href="https://github.com/JanssenProject/jans/blob/c820fc3e3e44b089834c45f403756cd1f0046e57/jans-cedarling/cedarling/src/common/policy_store/archive_handler.rs#L446-L460"
				><code>cedarling/src/common/policy_store/archive_handler.rs</code></a
			>
		</figcaption>
	</figure>
	<p>Another placeholder paragraph after the code block.</p>
</div>
