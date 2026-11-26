<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	let { data } = $props();

	const formatDate = (iso: string) =>
		new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
</script>

<Seo
	description={data.meta.description}
	type="article"
	image={data.meta.cover ?? undefined}
	publishedTime={data.meta.date}
	modifiedTime={data.meta.updated ?? undefined}
/>

<div class="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
	<a
		href="/blog"
		class="text-text-muted hover:text-matcha mb-6 inline-flex items-center gap-2 font-mono text-sm transition-colors"
	>
		<span class="text-matcha">$</span> cd ..
	</a>

	<!-- Outer frame: the whole article lives inside one terminal window -->
	<article class="border-border bg-bg-card overflow-hidden rounded-xl border shadow-xl">
		<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
				<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
				<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
			</div>
			<span class="truncate font-mono text-sm text-white">{data.meta.slug}.md</span>
		</div>

		<div class="p-6 md:p-10">
			<header class="border-border mb-10 border-b pb-8">
				<p class="text-text-muted/80 mb-4 font-mono text-xs">
					<span class="text-matcha">$</span> cat {data.meta.slug}.md
				</p>
				<h1 class="mb-4 text-3xl leading-tight font-bold text-white md:text-4xl">
					{data.meta.title}
				</h1>
				<p class="text-text-muted mb-6">{data.meta.description}</p>

				<div class="text-text-muted flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
					<span>📅 {formatDate(data.meta.date)}</span>
					{#if data.meta.updated && data.meta.updated !== data.meta.date}
						<span>✏️ diperbarui {formatDate(data.meta.updated)}</span>
					{/if}
					<span>⏱ {data.meta.readingMinutes} menit baca</span>
				</div>

				{#if data.meta.tags.length}
					<div class="mt-4 flex flex-wrap gap-2">
						{#each data.meta.tags as tag (tag)}
							<span
								class="border-border bg-bg text-text inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-medium"
							>
								<span class="text-matcha font-bold [text-shadow:0_0_8px_var(--color-matcha)]"
									>#</span
								>
								<span class="capitalize">{tag}</span>
							</span>
						{/each}
					</div>
				{/if}
			</header>

			<!-- Markdown is written by me and rendered on the server, so {@html} is safe here -->
			<div class="prose-term">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html data.html}
			</div>

			<footer class="border-border text-text-muted mt-12 border-t pt-6 font-mono text-sm">
				<a href="/blog" class="hover:text-matcha transition-colors">
					<span class="text-matcha">$</span> cd .. <span class="text-matcha">←</span> kembali ke semua
					tulisan
				</a>
			</footer>
		</div>
	</article>
</div>
