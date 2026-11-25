<script lang="ts">
	import CertificateCard from '$lib/components/CertificateCard.svelte';
	import { reveal } from '$lib/actions/reveal';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();

	// Same editor-tab style as the Project page; each tab keeps its own accent color
	const tabs = [
		{ file: 'all.md', value: 'all', emoji: '📂', color: '#8ab17d' },
		{ file: 'winner.md', value: 'winner', emoji: '🏆', color: '#ffbd2e' }
	] as const;

	// Keeps the filter in the URL; changing the filter always goes back to page 1
	function href(filter: string, page = 1) {
		const parts: string[] = [];
		if (filter !== 'all') parts.push(`filter=${filter}`);
		if (page > 1) parts.push(`page=${page}`);
		return parts.length ? `/certificate?${parts.join('&')}` : '/certificate';
	}
</script>

<Seo
	description="Sertifikat kursus dan pencapaian lomba yang pernah saya raih, termasuk juara kompetisi."
/>

<section class="w-full px-6 py-16 md:px-16 lg:px-24">
	<PageHeading command="ls ./certificates" />

	<!-- Filter: editor-style tabs, the active tab gets a colored top bar -->
	<div
		class="enter mb-8 scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden"
		style="animation-delay: 150ms"
	>
		<div class="border-border flex min-w-max items-end gap-1 border-b pt-2 font-mono text-sm">
			{#each tabs as f (f.value)}
				{@const active = data.filter === f.value}
				<a
					href={href(f.value)}
					data-sveltekit-noscroll
					aria-current={active ? 'true' : undefined}
					class="relative -mb-px flex shrink-0 items-center gap-2 rounded-t-lg border px-5 py-2.5 font-semibold transition-all duration-200 {active
						? 'border-border border-b-bg-card bg-bg-card text-text'
						: 'text-text-muted hover:bg-matcha/10 hover:text-matcha border-transparent'}"
				>
					{#if active}
						<span
							class="accent absolute inset-x-0 top-0 h-0.5 rounded-t-lg"
							style="background: {f.color}; box-shadow: 0 0 10px {f.color};"
						></span>
					{/if}
					<span>{f.emoji}</span>
					{f.file}
				</a>
			{/each}
		</div>
	</div>

	{#if data.items.length === 0}
		<p class="text-text-muted font-mono">Belum ada sertifikat di kategori ini.</p>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.items as certificate, i (certificate.id)}
				<div
					class="h-full {i < 3 ? 'enter' : ''}"
					style={i < 3 ? `animation-delay: ${250 + i * 90}ms` : undefined}
					use:reveal={{ delay: (i % 3) * 90 }}
				>
					<CertificateCard {certificate} />
				</div>
			{/each}
		</div>
	{/if}

	<Pagination page={data.page} totalPages={data.totalPages} href={(p) => href(data.filter, p)} />
</section>

<style>
	/* The colored top bar of the active tab grows in from the left */
	.accent {
		transform-origin: left;
		animation: grow 0.3s ease-out;
	}

	@keyframes grow {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.accent {
			animation: none;
		}
	}
</style>
