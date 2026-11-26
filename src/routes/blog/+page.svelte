<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { reveal } from '$lib/actions/reveal';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();

	const href = (page: number) => (page > 1 ? `/blog?page=${page}` : '/blog');
</script>

<Seo description="Catatan belajar seputar backend, database, dan tools sehari-hari." />

<section class="w-full px-6 py-16 md:px-16 lg:px-24">
	<PageHeading command="ls ./blog" />

	<!-- Single editor-style tab, same look as the Project and Certificate pages -->
	<div
		class="enter mb-8 scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden"
		style="animation-delay: 150ms"
	>
		<div class="border-border flex min-w-max items-end gap-1 border-b pt-2 font-mono text-sm">
			<a
				href="/blog"
				aria-current="true"
				class="border-border border-b-bg-card bg-bg-card text-text relative -mb-px flex shrink-0 items-center gap-2 rounded-t-lg border px-5 py-2.5 font-semibold"
			>
				<span
					class="accent absolute inset-x-0 top-0 h-0.5 rounded-t-lg"
					style="background: #8ab17d; box-shadow: 0 0 10px #8ab17d;"
				></span>
				<span>📂</span>
				all.md
			</a>
		</div>
	</div>

	{#if data.posts.length}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.posts as post, i (post.slug)}
				<div
					class="h-full {i < 3 ? 'enter' : ''}"
					style={i < 3 ? `animation-delay: ${250 + i * 90}ms` : undefined}
					use:reveal={{ delay: (i % 3) * 90 }}
				>
					<BlogCard {post} />
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-text-muted font-mono text-sm">
			<span class="text-matcha">$</span> belum ada tulisan di sini.
		</p>
	{/if}

	<Pagination page={data.page} totalPages={data.totalPages} {href} />
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
