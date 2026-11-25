<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { socials } from '$lib/data/socials';
	import { scrollToSection } from '$lib/utils/scroll';

	// Only show socials flagged for the Hero row (email is excluded)
	const heroSocials = socials.filter((s) => s.inHero);

	// Smooth scroll to the contact section instead of a hard jump
	function goToContact(event: MouseEvent) {
		if (scrollToSection('contact')) {
			event.preventDefault();
			replaceState('/#contact', {});
		}
	}
</script>

<svelte:head>
	<link rel="preload" as="image" href="/profile.webp" />
</svelte:head>

<section
	id="home"
	class="relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden px-6 py-12 md:px-16 lg:px-24"
>
	<!-- Subtle background glow (radial gradient instead of a blur filter, much cheaper to render) -->
	<div
		class="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(138,177,125,0.10),transparent_70%)]"
	></div>

	<div class="relative z-10 grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
		<!-- Left side: text & buttons -->
		<div class="flex max-w-2xl flex-col items-start space-y-6">
			<!-- Main heading -->
			<h1
				class="enter text-text text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
				style="animation-delay: 100ms"
			>
				Software Engineering.<br />
				<span class="text-matcha">Code Crafter.</span>
			</h1>

			<!-- Description -->
			<p
				class="enter text-text-muted text-lg leading-relaxed md:text-xl"
				style="animation-delay: 200ms"
			>
				Halo, saya <span class="text-text font-semibold">Wahyu Pratama</span>. Mengubah kebutuhan
				kompleks menjadi sistem perangkat lunak yang jelas, terkelola, dan siap tumbuh bersama
				produk.
			</p>

			<!-- Action buttons -->
			<div class="enter flex flex-wrap items-center gap-4 pt-2" style="animation-delay: 300ms">
				<!-- Download CV: solid matcha -->
				<a
					href="/cv.pdf"
					download
					class="group bg-matcha text-bg hover:bg-matcha-glow relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5 font-bold shadow-[0_8px_24px_-8px_rgba(138,177,125,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-8px_rgba(138,177,125,0.8)] active:scale-95"
				>
					<!-- Light sweep on hover -->
					<span
						class="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
					></span>

					<svg
						class="relative h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.4"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M12 3v12" />
						<path d="m7 11 5 5 5-5" />
						<path d="M5 21h14" />
					</svg>
					<span class="relative">Download CV</span>
				</a>

				<!-- Hubungi Saya: solid white so it stands out next to the matcha button -->
				<a
					href="/#contact"
					onclick={goToContact}
					class="group text-bg relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-white px-7 py-3.5 font-bold shadow-[0_8px_24px_-8px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-8px_rgba(255,255,255,0.55)] active:scale-95"
				>
					<span
						class="via-matcha/30 pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent to-transparent transition-transform duration-700 group-hover:translate-x-full"
					></span>

					<svg
						class="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.4"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
					<span class="relative">Hubungi Saya</span>
				</a>
			</div>
		</div>

		<!-- Right side: photo in a terminal frame -->
		<div
			class="enter mx-auto w-full max-w-xs sm:max-w-sm lg:ml-auto"
			style="animation-delay: 150ms"
		>
			<!-- Frame: only the border color changes on hover (cheap to render) -->
			<div
				class="group border-border bg-bg-card hover:border-matcha/60 relative overflow-hidden rounded-xl border shadow-xl transition-colors duration-300"
			>
				<!-- Terminal header -->
				<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
					<div class="flex gap-1.5">
						<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
						<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
						<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
					</div>
					<span class="font-mono text-xs text-white">profile.jpg</span>
				</div>

				<!-- Image -->
				<div class="bg-bg relative p-2">
					<div class="relative overflow-hidden rounded-lg">
						<!-- Full-color photo, no grayscale -->
						<img
							src="/profile.webp"
							alt="Wahyu Pratama"
							width="800"
							height="800"
							fetchpriority="high"
							decoding="async"
							class="aspect-4/5 w-full object-cover"
						/>

						<!-- Scanner line sweeping down the photo -->
						<div class="scan pointer-events-none absolute inset-x-0 top-0 h-20"></div>

						<!-- Viewfinder corners -->
						<span
							class="border-matcha pointer-events-none absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2"
						></span>
						<span
							class="border-matcha pointer-events-none absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2"
						></span>
						<span
							class="border-matcha pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2"
						></span>
						<span
							class="border-matcha pointer-events-none absolute right-3 bottom-3 h-5 w-5 border-r-2 border-b-2"
						></span>
					</div>
				</div>
			</div>

			<!-- Social links under the photo: white by default, fill with matcha on hover -->
			<div class="enter mt-5 grid grid-cols-3 gap-2" style="animation-delay: 500ms">
				{#each heroSocials as social (social.name)}
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={social.name}
						class="group hover:border-matcha hover:bg-matcha hover:text-bg flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-2 py-2.5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(138,177,125,0.45)]"
					>
						<!-- White icon by default, dark icon on hover (swapped with opacity) -->
						<!-- The icon is a mask, so it simply follows the link's text color (white, dark on hover) -->
						<span
							class="h-4 w-4 shrink-0 bg-current"
							style="-webkit-mask: url(/icons/social/{social.slug}.svg) center / contain no-repeat; mask: url(/icons/social/{social.slug}.svg) center / contain no-repeat;"
							aria-hidden="true"
						></span>
						<!-- Name hidden on very small screens so all three stay on one row -->
						<span class="hidden font-mono text-xs font-semibold sm:inline">{social.name}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* Plain gradient + transform only (no blend modes), so it stays smooth */
	.scan {
		background: linear-gradient(to bottom, transparent, rgba(138, 177, 125, 0.35), transparent);
		animation: scan 6s ease-in-out infinite;
	}

	@keyframes scan {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(600%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scan {
			animation: none;
		}
	}
</style>
