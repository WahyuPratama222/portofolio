<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { navigating } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="selection:bg-matcha selection:text-bg flex min-h-screen flex-col">
	<!-- Thin progress line while a page change is loading -->
	{#if navigating.to}
		<div class="nav-progress" aria-hidden="true"></div>
	{/if}
	<Navbar />

	<main class="w-full flex-1">
		{@render children()}
	</main>

	<Footer />
</div>
