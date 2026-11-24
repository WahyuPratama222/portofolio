<script lang="ts">
	import { goto, replaceState } from '$app/navigation';
	import { scrollToSection, scrollToTop } from '$lib/utils/scroll';

	// Controls the mobile dropdown menu
	let menuOpen = $state(false);

	const menuItems = [
		{ name: '$home', href: '/' },
		{ name: '$about', href: '/#about' },
		{ name: '$project', href: '/project' },
		{ name: '$certificate', href: '/certificate' },
		{ name: '$blog', href: '/blog' },
		{ name: '$contact', href: '/#contact' }
	];

	// On the home page, Home / About / Contact scroll smoothly to the right spot.
	// From any other page the link just navigates normally.
	async function handleClick(event: MouseEvent, href: string) {
		menuOpen = false;

		const isSectionLink = href === '/' || href.startsWith('/#');
		if (!isSectionLink) return;

		if (window.location.pathname !== '/') {
			// "$home" from another page is a plain navigation, nothing to scroll to
			if (href === '/') return;

			event.preventDefault();
			await goto('/'); // loads the home page and puts it at the top
			// Wait one frame so the home sections are in the DOM before scrolling
			await new Promise((resolve) => requestAnimationFrame(resolve));
			if (scrollToSection(href.slice(2))) replaceState(href, {});
			return;
		}

		if (href === '/') {
			event.preventDefault();
			scrollToTop();
			replaceState('/', {});
		} else if (scrollToSection(href.slice(2))) {
			event.preventDefault();
			replaceState(href, {});
		}
	}
</script>

<!-- Solid background (no backdrop-blur): blurring everything behind a sticky bar is costly while scrolling -->
<header class="border-border bg-bg-nav sticky top-0 z-50 w-full border-b shadow-lg">
	<nav class="flex w-full items-center justify-between px-4 py-3.5 md:px-8">
		<!-- Left: window dots (hidden on very small screens) + terminal-style name -->
		<div class="flex items-center gap-4">
			<div class="hidden items-center gap-1.5 sm:flex">
				<span class="inline-block h-3.5 w-3.5 rounded-full bg-[#ff5f56] shadow-sm"></span>
				<span class="inline-block h-3.5 w-3.5 rounded-full bg-[#ffbd2e] shadow-sm"></span>
				<span class="inline-block h-3.5 w-3.5 rounded-full bg-[#27c93f] shadow-sm"></span>
			</div>

			<a
				href="/"
				onclick={(e) => handleClick(e, '/')}
				class="group flex items-center gap-1 text-lg font-semibold tracking-wide"
			>
				<span class="text-matcha group-hover:text-text transition-colors duration-200">~/my$</span>
				<span class="text-text group-hover:text-matcha transition-colors duration-200"
					>Wahyu Pratama</span
				>
			</a>
		</div>

		<!-- Desktop menu -->
		<div class="hidden items-center gap-7 text-base md:flex">
			{#each menuItems as item (item.href)}
				<a
					href={item.href}
					onclick={(e) => handleClick(e, item.href)}
					class="group hover:text-matcha relative py-1 font-medium text-white transition-colors duration-200"
				>
					<span class="text-matcha">$</span>{item.name.slice(1)}
					<span
						class="bg-matcha absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 shadow-[0_0_8px_var(--color-matcha)] transition-all duration-300 group-hover:w-full"
					></span>
				</a>
			{/each}
		</div>

		<!-- Mobile: hamburger -->
		<div class="flex items-center gap-3 md:hidden">
			<button
				onclick={() => (menuOpen = !menuOpen)}
				aria-label="Toggle menu"
				aria-expanded={menuOpen}
				class="text-matcha cursor-pointer px-2 text-xl"
			>
				{menuOpen ? '✕' : '☰'}
			</button>
		</div>
	</nav>

	<!-- Mobile dropdown -->
	{#if menuOpen}
		<div class="border-border flex flex-col border-t px-4 py-2 md:hidden">
			{#each menuItems as item (item.href)}
				<a
					href={item.href}
					onclick={(e) => handleClick(e, item.href)}
					class="hover:text-matcha py-2.5 font-medium text-white transition-colors"
				>
					<span class="text-matcha">$</span>{item.name.slice(1)}
				</a>
			{/each}
		</div>
	{/if}
</header>
