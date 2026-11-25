<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import GitHubContributions from '$lib/components/GitHubContributions.svelte';
	import { reveal } from '$lib/actions/reveal';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();

	// Each status keeps the same color used on the project cards
	const filters = [
		{ file: 'all.md', value: 'all', emoji: '📂', color: '#8ab17d' },
		{ file: 'ongoing.md', value: 'ongoing', emoji: '🚧', color: '#ffbd2e' },
		{ file: 'completed.md', value: 'completed', emoji: '✅', color: '#27c93f' }
	];

	// Build a URL that keeps the filter; changing the filter resets the page to 1
	function href(page: number, status: string) {
		const parts: string[] = [];
		if (status !== 'all') parts.push(`status=${status}`);
		if (page > 1) parts.push(`page=${page}`);
		return parts.length ? `/project?${parts.join('&')}` : '/project';
	}
</script>

<Seo
	description="Kumpulan project backend dan web yang pernah saya bangun, lengkap dengan peran, masalah yang diselesaikan, dan tech stack-nya."
/>

<section class="w-full px-6 py-16 md:px-16 lg:px-24">
	<PageHeading command="ls ./projects" />

	<!-- GitHub contribution graph: skeleton while loading, hidden if the API fails -->
	{#await data.contributions}
		<div class="border-border bg-bg-card mb-10 h-56 animate-pulse rounded-xl border"></div>
	{:then contributions}
		{#if contributions}
			<div class="mb-10">
				<GitHubContributions data={contributions} />
			</div>
		{/if}
	{/await}

	<!-- Status filter: editor-style tabs, the active tab gets a colored top bar -->
	<!-- Outer wrapper scrolls on small screens (scrollbar hidden); inner one draws the baseline -->
	<div
		class="enter mb-8 scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden"
		style="animation-delay: 150ms"
	>
		<div class="border-border flex min-w-max items-end gap-1 border-b pt-2 font-mono text-sm">
			{#each filters as f (f.value)}
				{@const active = data.status === f.value}
				<a
					href={href(1, f.value)}
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
		<p class="text-text-muted font-mono">Belum ada project di kategori ini.</p>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.items as project, i (project.id)}
				<div
					class="h-full {i < 3 ? 'enter' : ''}"
					style={i < 3 ? `animation-delay: ${250 + i * 90}ms` : undefined}
					use:reveal={{ delay: (i % 3) * 90 }}
				>
					<ProjectCard {project} />
				</div>
			{/each}
		</div>
	{/if}

	<Pagination page={data.page} totalPages={data.totalPages} href={(p) => href(p, data.status)} />
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
