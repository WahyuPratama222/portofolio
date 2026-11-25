<script lang="ts">
	import type { getFeaturedProjects } from '$lib/server/queries/projects';

	type Project = Awaited<ReturnType<typeof getFeaturedProjects>>[number];
	let { project }: { project: Project } = $props();

	// Fake terminal file name, e.g. "heavylift.md"
	const fileName = $derived(project.name.toLowerCase().replace(/\s+/g, '-') + '.md');

	// open = link exists, locked = hidden on purpose, none = no link at all
	type Cell = {
		label: string;
		icon: string;
		href: string | null;
		state: 'open' | 'locked' | 'none';
		tone: 'white' | 'matcha';
	};

	function makeCell(
		label: string,
		icon: string,
		url: string | null,
		visibility: string,
		tone: 'white' | 'matcha'
	): Cell {
		const state = url ? 'open' : visibility === 'hidden' ? 'locked' : 'none';
		return { label, icon, href: url, state, tone };
	}

	// Left = GitHub (white), right = web (matcha), always both so the footer stays balanced
	const cells = $derived([
		makeCell('GitHub', 'social/github', project.githubUrl, project.githubVisibility, 'white'),
		makeCell('Live', 'globe', project.webUrl, project.webVisibility, 'matcha')
	]);

	// Icons are self-hosted SVGs used as masks, so they take the text color of their parent
	const maskStyle = (name: string) =>
		`-webkit-mask: url(/icons/${name}.svg) center / contain no-repeat; mask: url(/icons/${name}.svg) center / contain no-repeat;`;
</script>

<article
	class="group border-border bg-bg-card hover:border-matcha/60 flex h-full flex-col overflow-hidden rounded-xl border shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(138,177,125,0.25)]"
>
	<!-- Terminal title bar -->
	<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
		<div class="flex items-center gap-1.5">
			<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
			<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
			<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
		</div>
		<span class="font-mono text-sm text-white">{fileName}</span>
		<!-- Pure green vs yellow -->
		<span
			class="ml-auto font-mono text-xs font-semibold {project.status === 'completed'
				? 'text-[#27c93f]'
				: 'text-[#ffbd2e]'}"
		>
			● {project.status === 'completed' ? 'Completed' : 'Ongoing'}
		</span>
	</div>

	{#if project.previewImage}
		<img
			src={project.previewImage}
			alt={project.name}
			class="border-border aspect-video w-full border-b object-cover"
			loading="lazy"
		/>
	{:else}
		<!-- Fallback when no preview image is set -->
		<div
			class="border-border bg-bg text-text-muted flex aspect-video w-full items-center justify-center border-b font-mono text-sm"
		>
			<span class="text-matcha">$</span>&nbsp;no preview
		</div>
	{/if}

	<div class="flex flex-1 flex-col gap-5 p-6">
		<!-- Title & description, underline slides in from the left on card hover -->
		<div class="space-y-2">
			<div class="inline-block">
				<h3
					class="text-matcha group-hover:text-text relative pb-1 text-2xl font-bold tracking-tight transition-colors duration-200"
				>
					{project.name}
					<span
						class="bg-matcha absolute bottom-0 left-0 h-0.5 w-0 shadow-[0_0_8px_var(--color-matcha)] transition-all duration-300 group-hover:w-full"
					></span>
				</h3>
			</div>
			<p class="text-text-muted text-sm leading-relaxed">{project.description}</p>
		</div>

		<!-- PROBLEM -->
		{#if project.problemSolved}
			<div class="border-matcha/30 bg-bg relative overflow-hidden rounded-lg border p-4">
				<div class="bg-matcha absolute top-0 left-0 h-full w-1"></div>
				<div class="mb-1.5 flex items-center justify-between">
					<span
						class="text-matcha flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider uppercase"
					>
						<span class="bg-matcha inline-block h-1.5 w-1.5 animate-pulse rounded-full"></span>
						challenge & solution
					</span>
				</div>
				<p class="text-text text-sm leading-relaxed">
					{project.problemSolved}
				</p>
			</div>
		{/if}

		<!-- Bottom part (Role & Stack) -->
		<div class="mt-auto grid grid-cols-1 gap-4 pt-2">
			<!-- ROLE -->
			<div
				class="border-border/80 bg-bg/60 flex items-center justify-between rounded-lg border px-3.5 py-2.5 font-mono text-xs"
			>
				<span class="text-text-muted text-[10px] tracking-wider uppercase">Assigned Role</span>
				<span
					class="text-matcha bg-matcha/10 border-matcha/20 rounded border px-2 py-0.5 font-semibold"
				>
					{project.role.join(' · ')}
				</span>
			</div>

			<!-- STACK -->
			<div class="space-y-2">
				<div class="text-text-muted font-mono text-[10px] tracking-wider uppercase">
					Tech Stack Used
				</div>
				<div class="flex flex-wrap gap-2">
					{#each project.projectTags as pt (pt.tag.id)}
						<span
							class="border-border bg-bg text-text hover:border-matcha/50 hover:bg-matcha/5 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-all"
						>
							<span
								class="h-2 w-2 rounded-full shadow-[0_0_6px_currentColor]"
								style="color: {pt.tag.color}; background: {pt.tag.color};"
							></span>
							<span>{pt.tag.name}</span>
						</span>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Footer: left = GitHub (white), right = web (matcha), always two equal halves -->
	<div class="divide-border border-border bg-bg-nav grid grid-cols-2 divide-x border-t text-sm">
		{#each cells as cell (cell.label)}
			{#if cell.state === 'open'}
				<a
					href={cell.href}
					target="_blank"
					rel="noopener noreferrer"
					class="group/btn relative flex items-center justify-center gap-2 overflow-hidden py-3.5 font-semibold transition-colors duration-300 {cell.tone ===
					'white'
						? 'text-white hover:bg-white/10'
						: 'text-matcha hover:bg-matcha/15'}"
				>
					<!-- Glowing line grows from left to right on hover -->
					<span
						class="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover/btn:w-full {cell.tone ===
						'white'
							? 'bg-white shadow-[0_0_8px_white]'
							: 'bg-matcha shadow-[0_0_8px_var(--color-matcha)]'}"
					></span>

					<span
						class="h-4 w-4 bg-current transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:-rotate-12"
						style={maskStyle(cell.icon)}
						aria-hidden="true"
					></span>
					{cell.label}
					<span
						class="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
						>↗</span
					>
				</a>
			{:else}
				<div
					class="text-text-muted/70 flex cursor-not-allowed items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_6px,rgba(255,255,255,0.04)_6px,rgba(255,255,255,0.04)_12px)] py-3.5"
					title={cell.state === 'locked' ? 'Private' : 'Not available'}
				>
					<span
						class="h-4 w-4 bg-current opacity-70"
						style={maskStyle(cell.state === 'locked' ? 'lock' : cell.icon)}
						aria-hidden="true"
					></span>
					{cell.label}
					<span class="text-xs">· {cell.state === 'locked' ? 'Private' : 'N/A'}</span>
				</div>
			{/if}
		{/each}
	</div>
</article>
