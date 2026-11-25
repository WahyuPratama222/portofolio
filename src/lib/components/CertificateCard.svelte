<script lang="ts">
	import { lang } from '$lib/stores/lang.svelte';
	import type { getAllCertificates } from '$lib/server/queries/certificates';

	type Certificate = Awaited<ReturnType<typeof getAllCertificates>>[number];
	let { certificate }: { certificate: Certificate } = $props();

	// Fake terminal file name, e.g. "juara-1-redesign-competition.pdf"
	const fileName = $derived(
		certificate.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '') + '.pdf'
	);

	// Date follows the current UI language; the DB value is a plain YYYY-MM-DD string
	const dateText = $derived(
		new Date(certificate.date).toLocaleDateString(lang.value === 'id' ? 'id-ID' : 'en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		})
	);
</script>

<article
	class="group border-border bg-bg-card hover:border-matcha/60 relative flex h-full flex-col overflow-hidden rounded-xl border shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(138,177,125,0.25)]"
>
	<!-- Gold accent line for competition winners -->
	{#if certificate.isWinner}
		<div class="absolute inset-x-0 top-0 z-10 h-0.5 bg-[#ffbd2e] shadow-[0_0_10px_#ffbd2e]"></div>
	{/if}

	<!-- Terminal title bar -->
	<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
		<div class="flex shrink-0 items-center gap-1.5">
			<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
			<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
			<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
		</div>
		<span class="min-w-0 truncate font-mono text-sm text-white">{fileName}</span>
	</div>

	{#if certificate.previewImage}
		<!-- object-contain so the full certificate stays readable -->
		<img
			src={certificate.previewImage}
			alt={certificate.name}
			class="border-border bg-bg aspect-video w-full border-b object-contain"
			loading="lazy"
		/>
	{:else}
		<div
			class="border-border bg-bg text-text-muted flex aspect-video w-full items-center justify-center border-b font-mono text-sm"
		>
			<span class="text-matcha">$</span>&nbsp;no preview
		</div>
	{/if}

	<div class="flex flex-1 flex-col gap-4 p-6">
		<div class="space-y-2">
			<div class="inline-block">
				<h3
					class="text-matcha group-hover:text-text relative pb-1 text-xl font-bold tracking-tight transition-colors duration-200"
				>
					{certificate.name}
					<!-- Underline slides in from the left on card hover -->
					<span
						class="bg-matcha absolute bottom-0 left-0 h-0.5 w-0 shadow-[0_0_8px_var(--color-matcha)] transition-all duration-300 group-hover:w-full"
					></span>
				</h3>
			</div>

			<!-- Date + winner badge share one row, so nothing covers the title or file name -->
			<div class="flex flex-wrap items-center gap-2">
				<p class="text-text-muted font-mono text-xs">📅 {dateText}</p>

				{#if certificate.isWinner}
					<span
						class="rounded-full border border-[#ffbd2e]/40 bg-[#ffbd2e]/10 px-2.5 py-0.5 font-mono text-xs font-bold text-[#ffbd2e]"
					>
						🏆 Winner
					</span>
				{/if}
			</div>

			{#if certificate.description}
				<p class="text-text-muted text-sm leading-relaxed">{certificate.description}</p>
			{/if}
		</div>

		{#if certificate.certificateTags.length}
			<div class="mt-auto flex flex-wrap gap-2 pt-2">
				{#each certificate.certificateTags as ct (ct.tag.id)}
					<span
						class="border-border bg-bg text-text hover:border-matcha/50 hover:bg-matcha/5 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-all"
					>
						<span
							class="h-2 w-2 rounded-full shadow-[0_0_6px_currentColor]"
							style="color: {ct.tag.color}; background: {ct.tag.color};"
						></span>
						<span>{ct.tag.name}</span>
					</span>
				{/each}
			</div>
		{/if}
	</div>
</article>
