<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import CertificateCard from '$lib/components/CertificateCard.svelte';
	import SeeAllButton from '$lib/components/SeeAllButton.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { reveal } from '$lib/actions/reveal';

	let { data } = $props();
</script>

<Seo
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Wahyu Pratama',
		sameAs: [
			'https://github.com/WahyuPratama222',
			'https://www.linkedin.com/in/wahyu-pratama-ptm',
			'https://www.instagram.com/wahyu0020'
		]
	}}
/>

<Hero />

<div class="px-6 md:px-16 lg:px-24">
	<div class="via-matcha/30 h-px bg-linear-to-r from-transparent to-transparent"></div>
</div>

<About experiences={data.experiences} />

<div class="px-6 md:px-16 lg:px-24">
	<div class="via-matcha/30 h-px bg-linear-to-r from-transparent to-transparent"></div>
</div>

<!-- Featured projects teaser. The reveal animation sits on the inner wrapper so the section
     itself never moves and anchor links stay accurate. -->
<section id="project" class="w-full scroll-mt-6 px-6 py-16 md:px-16 lg:px-24">
	<div use:reveal>
		<h2 class="text-text mb-8 text-2xl font-bold">
			<span class="text-matcha">$</span> ./projects
		</h2>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.featured as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</div>

		<div class="mt-8 flex justify-center">
			<SeeAllButton href="/project" label="Lihat Semua Project" />
		</div>
	</div>
</section>

<div class="px-6 md:px-16 lg:px-24">
	<div class="via-matcha/30 h-px bg-linear-to-r from-transparent to-transparent"></div>
</div>

<!-- Certificates teaser: winners first -->
<section id="certificate" class="w-full scroll-mt-6 px-6 py-16 md:px-16 lg:px-24">
	<div use:reveal>
		<h2 class="text-text mb-8 text-2xl font-bold">
			<span class="text-matcha">$</span> ./certificates
		</h2>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.certificates as certificate (certificate.id)}
				<CertificateCard {certificate} />
			{/each}
		</div>

		<div class="mt-8 flex justify-center">
			<SeeAllButton href="/certificate" label="Lihat Semua Sertifikat" />
		</div>
	</div>
</section>

<div class="px-6 md:px-16 lg:px-24">
	<div class="via-matcha/30 h-px bg-linear-to-r from-transparent to-transparent"></div>
</div>

<Contact />
