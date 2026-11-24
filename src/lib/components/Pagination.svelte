<script lang="ts">
	// Shared page switcher (same look as the one on the Project page).
	// `href` builds the URL for a given page number, so each page keeps its own filters.
	let {
		page,
		totalPages,
		href
	}: { page: number; totalPages: number; href: (page: number) => string } = $props();
</script>

{#if totalPages > 1}
	<nav
		aria-label="Pagination"
		class="mt-10 flex flex-wrap items-center justify-center gap-2 font-mono text-sm"
	>
		{#if page > 1}
			<a href={href(page - 1)} class="text-matcha px-3 py-1.5 hover:underline">← prev</a>
		{/if}

		{#each Array.from({ length: totalPages }, (_, i) => i + 1) as n (n)}
			<a
				href={href(n)}
				aria-current={n === page ? 'page' : undefined}
				class="rounded-md border px-3 py-1.5 transition-colors {n === page
					? 'border-matcha bg-matcha/10 text-matcha'
					: 'border-border text-text-muted hover:border-matcha/50'}"
			>
				{n}
			</a>
		{/each}

		{#if page < totalPages}
			<a href={href(page + 1)} class="text-matcha px-3 py-1.5 hover:underline">next →</a>
		{/if}
	</nav>
{/if}
