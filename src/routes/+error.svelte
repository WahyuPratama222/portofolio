<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';

	const is404 = $derived(page.status === 404);
	const path = $derived(page.url.pathname);
</script>

<Seo noindex />

<section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-12">
	<div
		class="enter border-border bg-bg-card w-full max-w-2xl overflow-hidden rounded-xl border shadow-xl"
	>
		<!-- Terminal title bar -->
		<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
				<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
				<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
			</div>
			<span class="font-mono text-sm text-white">bash</span>
		</div>

		<div class="space-y-5 p-6 font-mono text-sm sm:p-8">
			{#if is404}
				<!-- Fake shell session that "fails" on the missing path -->
				<div class="space-y-1.5">
					<p class="break-all"><span class="text-matcha">$</span> cd {path}</p>
					<p class="break-all text-[#ff5f56]">bash: cd: {path}: No such file or directory</p>
					<p><span class="text-matcha">$</span> echo $?</p>
				</div>

				<p class="text-matcha text-6xl font-extrabold tracking-tight sm:text-7xl">404</p>
				<p class="text-text-muted leading-relaxed">
					Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.
				</p>
			{:else}
				<div class="space-y-1.5">
					<p><span class="text-matcha">$</span> ./run</p>
					<p class="text-[#ff5f56]">error: process exited with code {page.status}</p>
				</div>

				<p class="text-matcha text-6xl font-extrabold tracking-tight sm:text-7xl">{page.status}</p>
				<p class="text-text-muted leading-relaxed">
					{page.error?.message ?? 'Terjadi kesalahan di server. Coba lagi sebentar lagi.'}
				</p>
			{/if}

			<div class="flex flex-wrap gap-3 pt-2">
				<a
					href="/"
					class="bg-matcha text-bg hover:bg-matcha-glow rounded-lg px-5 py-2.5 font-bold transition-colors duration-200"
				>
					$ cd ~
				</a>
				<button
					type="button"
					onclick={() => history.back()}
					class="border-border hover:border-matcha hover:text-matcha cursor-pointer rounded-lg border px-5 py-2.5 font-bold text-white transition-colors duration-200"
				>
					$ cd ..
				</button>
			</div>
		</div>
	</div>
</section>
