<script lang="ts">
	import { page } from '$app/state';
	import {
		SITE_URL,
		SITE_NAME,
		DEFAULT_TITLE,
		DEFAULT_DESCRIPTION,
		DEFAULT_OG_IMAGE
	} from '$lib/config';

	let {
		title,
		description = DEFAULT_DESCRIPTION,
		image = DEFAULT_OG_IMAGE,
		type = 'website',
		publishedTime,
		modifiedTime,
		noindex = false,
		jsonLd
	}: {
		title?: string;
		description?: string;
		image?: string;
		type?: 'website' | 'article';
		publishedTime?: string;
		modifiedTime?: string;
		noindex?: boolean;
		jsonLd?: Record<string, unknown>;
	} = $props();

	const fullTitle = $derived(title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE);
	// Query strings (like ?page=2) are dropped so every list page shares one canonical URL
	const canonical = $derived(SITE_URL + (page.url.pathname === '/' ? '' : page.url.pathname));
	const imageUrl = $derived(image.startsWith('http') ? image : SITE_URL + image);

	// "<" is escaped so the JSON can never close the script tag early
	const jsonText = $derived(jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<!-- Open Graph (LinkedIn, WhatsApp, Facebook, Discord) -->
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content="id_ID" />
	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if type === 'article' && modifiedTime}
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if jsonText}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html '<script type="application/ld+json">' + jsonText + '</' + 'script>'}
	{/if}
</svelte:head>
