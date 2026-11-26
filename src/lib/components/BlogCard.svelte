<script lang="ts">
	import type { PostMeta } from '$lib/server/blog';

	let { post }: { post: PostMeta } = $props();

	// Same date format as the certificate cards; the frontmatter value is a plain YYYY-MM-DD string
	const dateText = $derived(
		new Date(post.date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		})
	);

	// Posts from the last 14 days get a small "new" badge
	const isNew = $derived(Date.now() - new Date(post.date).getTime() < 14 * 24 * 60 * 60 * 1000);
</script>

<a
	href={`/blog/${post.slug}`}
	class="group border-border bg-bg-card hover:border-matcha/60 relative flex h-full flex-col overflow-hidden rounded-xl border shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(138,177,125,0.25)]"
>
	<!-- Terminal title bar -->
	<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
		<div class="flex shrink-0 items-center gap-1.5">
			<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
			<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
			<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
		</div>
		<span class="min-w-0 flex-1 truncate font-mono text-sm text-white">{post.slug}.md</span>
		{#if isNew}
			<span
				class="bg-matcha text-bg rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase"
				>new</span
			>
		{/if}
	</div>

	<!-- Cover image, only for posts that have one (frontmatter: cover) -->
	{#if post.cover}
		<img
			src={post.cover}
			alt=""
			loading="lazy"
			decoding="async"
			class="border-border bg-bg aspect-video w-full border-b object-cover"
		/>
	{/if}

	<div class="flex flex-1 flex-col gap-4 p-6">
		<div class="space-y-2">
			<div class="inline-block">
				<h3
					class="text-matcha group-hover:text-text relative pb-1 text-xl font-bold tracking-tight transition-colors duration-200"
				>
					{post.title}
					<!-- Underline slides in from the left on card hover -->
					<span
						class="bg-matcha absolute bottom-0 left-0 h-0.5 w-0 shadow-[0_0_8px_var(--color-matcha)] transition-all duration-300 group-hover:w-full"
					></span>
				</h3>
			</div>

			<!-- Date on the left, reading time on the right -->
			<div
				class="text-text-muted flex flex-wrap items-center justify-between gap-2 font-mono text-xs"
			>
				<p>📅 {dateText}</p>
				<p>⏱ {post.readingMinutes} Menit Baca</p>
			</div>

			<p class="text-text-muted line-clamp-3 text-sm leading-relaxed">{post.description}</p>
		</div>

		{#if post.tags.length}
			<div class="mt-auto flex flex-wrap gap-2 pt-2">
				{#each post.tags as tag (tag)}
					<span
						class="border-border bg-bg text-text hover:border-matcha/50 hover:bg-matcha/5 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-all"
					>
						<span class="text-matcha font-bold [text-shadow:0_0_8px_var(--color-matcha)]">#</span>
						<span class="capitalize">{tag}</span>
					</span>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Footer: read more -->
	<div class="border-border bg-bg-nav/60 relative border-t px-5 py-3 font-mono text-sm text-white">
		<span class="text-matcha">└─$</span> read more
		<span
			class="text-matcha inline-block transition-transform duration-300 group-hover:translate-x-1.5"
			>→</span
		>
	</div>
</a>
