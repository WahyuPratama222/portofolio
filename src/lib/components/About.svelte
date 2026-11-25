<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { getAllExperiences } from '$lib/server/queries/experiences';

	type Experience = Awaited<ReturnType<typeof getAllExperiences>>[number];
	let { experiences }: { experiences: Experience[] } = $props();

	// Quick facts shown under the bio
	const facts = [
		{ emoji: '📍', text: 'Palembang, Indonesia' },
		{ emoji: '🎓', text: 'Universitas Sriwijaya' },
		{ emoji: '💻', text: 'Teknik Informatika' },
		{ emoji: '⚙️', text: 'Software Engineering' }
	];

	// Emoji shown on the badges of each experience card
	const typeEmoji: Record<string, string> = {
		work: '💼',
		freelance: '🧑‍💻',
		organization: '🤝'
	};
	const locationEmoji: Record<string, string> = {
		onsite: '🏢',
		remote: '🏠',
		hybrid: '🔀'
	};

	// Things outside of code
	const beyondCode = [
		{ emoji: '🏋️', title: 'Olahraga', desc: 'Gym dan lari pagi' },
		{ emoji: '🎮', title: 'Main Game', desc: 'Pelepas penat setelah ngoding' },
		{ emoji: '📚', title: 'Baca Buku', desc: 'Literatur klasik, novel, dan self improvement' }
	];

	// Icons are self-hosted in static/icons/*.svg (no external requests while scrolling)
	const icon = (name: string) => `/icons/${name}.svg`;

	// Tech stack, grouped by category
	const stack = [
		{
			emoji: '💻',
			title: 'Languages',
			items: [
				{ name: 'TypeScript', icon: icon('typescript') },
				{ name: 'JavaScript', icon: icon('javascript') },
				{ name: 'Java', icon: icon('java') },
				{ name: 'PHP', icon: icon('php') },
				{ name: 'Python', icon: icon('python') }
			]
		},
		{
			emoji: '⚙️',
			title: 'Backend',
			items: [
				{ name: 'Node.js', icon: icon('nodejs') },
				{ name: 'Bun', icon: icon('bun') },
				{ name: 'Express', icon: icon('express') },
				{ name: 'NestJS', icon: icon('nestjs') }
			]
		},
		{
			emoji: '🗄️',
			title: 'Database',
			items: [
				{ name: 'PostgreSQL', icon: icon('postgresql') },
				{ name: 'MySQL', icon: icon('mysql') },
				{ name: 'Redis', icon: icon('redis') },
				{ name: 'Supabase', icon: icon('supabase') },
				{ name: 'Prisma', icon: icon('prisma') },
				{ name: 'Drizzle', icon: icon('drizzle') }
			]
		},
		{
			emoji: '🎨',
			title: 'Frontend',
			items: [
				{ name: 'HTML5', icon: icon('html5') },
				{ name: 'CSS3', icon: icon('css3') },
				{ name: 'Bootstrap', icon: icon('bootstrap') },
				{ name: 'Tailwind', icon: icon('tailwindcss') },
				{ name: 'SvelteKit', icon: icon('svelte') }
			]
		},
		{
			emoji: '🛠️',
			title: 'DevOps & Tools',
			items: [
				{ name: 'Git', icon: icon('git') },
				{ name: 'Docker', icon: icon('docker') }
			]
		},
		{
			emoji: '🚀',
			title: 'Deployment',
			items: [
				{ name: 'Vercel', icon: icon('vercel') },
				{ name: 'Railway', icon: icon('railway') }
			]
		}
	];

	// If an icon fails to load, hide it so no broken-image symbol shows (the name label stays)
	function hideBroken(event: Event) {
		(event.currentTarget as HTMLImageElement).style.display = 'none';
	}

	// "Maret 2026", full Indonesian month name
	const month = (d: string) =>
		new Date(d).toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' });
	const period = (e: Experience) =>
		`${month(e.startDate)} – ${e.endDate ? month(e.endDate) : 'Sekarang'}`;

	// Active while there is no end date, or the end date has not passed yet
	const isActive = (e: Experience) => !e.endDate || new Date(e.endDate) >= new Date();

	// Duration in whole calendar months (both ends count): Mar–Nov = 9 bulan.
	// An active entry is measured up to today, a finished one up to its end date.
	const duration = (e: Experience) => {
		const start = new Date(e.startDate);
		const end = isActive(e) ? new Date() : new Date(e.endDate!);
		const total =
			(end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
		const years = Math.floor(total / 12);
		const months = total % 12;
		return (
			[years ? `${years} Tahun` : '', months ? `${months} Bulan` : ''].filter(Boolean).join(' ') ||
			'1 Bulan'
		);
	};

	// Fallback when there is no logo: "(HMIF)" -> "HM", otherwise first letters of the first two words
	const initials = (name: string) => {
		const abbr = name.match(/\(([^)]+)\)/)?.[1];
		if (abbr) return abbr.slice(0, 2).toUpperCase();
		return name
			.split(/\s+/)
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();
	};

	const typeLabel = { work: 'Kerja', freelance: 'Freelance', organization: 'Organisasi' } as const;
	const locationLabel = { remote: 'Remote', onsite: 'Onsite', hybrid: 'Hybrid' } as const;
</script>

<!-- The content is always rendered (never hidden behind an {#if}), so the section keeps a stable
     height. That keeps anchor links accurate and lets search engines read it.
     The scroll animation lives on the inner wrapper. -->
<section id="about" class="w-full scroll-mt-6 px-6 py-16 md:px-16 lg:px-24">
	<div use:reveal>
		<h2 class="text-text mb-8 text-2xl font-bold">
			<span class="text-matcha">$</span> ./about_me
		</h2>

		<div class="grid gap-6 lg:grid-cols-3">
			<!-- 1. WHOAMI: short bio + quick facts -->
			<div
				class="border-border bg-bg-card hover:border-matcha/40 relative flex flex-col overflow-hidden rounded-xl border shadow-lg transition-colors duration-300 lg:col-span-2"
			>
				<!-- Decorative glow (radial gradient, cheaper than a blur filter) -->
				<div
					class="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(138,177,125,0.12),transparent_70%)]"
				></div>

				<div class="border-border bg-bg-nav relative flex items-center gap-3 border-b px-4 py-3">
					<div class="flex items-center gap-1.5">
						<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
						<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
						<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
					</div>
					<span class="font-mono text-sm text-white">whoami.txt</span>
				</div>

				<div class="relative flex flex-1 flex-col p-6 md:p-8">
					<p class="mb-4 font-mono text-sm">
						<span class="text-text font-medium">wahyu</span><span class="text-matcha/90"
							>@portfolio:~$</span
						>
						<span class="text-text">cat whoami.txt</span>
					</p>

					<div class="text-text-muted space-y-4 leading-relaxed">
						<p>
							Halo! Saya mahasiswa Teknik Informatika di Universitas Sriwijaya yang suka
							<span class="font-medium text-white">membangun software</span> dan terus belajar dari setiap
							proyek yang saya kerjakan.
						</p>
						<p>
							Saya senang bekerja dalam tim,
							<span class="font-medium text-white">belajar hal baru dengan cepat</span>, dan
							memastikan apa yang saya bangun
							<span class="font-medium text-white">rapi, berguna, dan bisa diandalkan</span>.
						</p>
					</div>

					<div class="mt-auto flex flex-wrap gap-2 pt-6">
						{#each facts as fact (fact.text)}
							<span
								class="border-border bg-bg text-text inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-xs"
							>
								<span>{fact.emoji}</span>{fact.text}
							</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- 2. BEYOND CODE -->
			<div
				class="border-border bg-bg-card hover:border-matcha/40 flex flex-col overflow-hidden rounded-xl border shadow-lg transition-colors duration-300"
			>
				<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
					<div class="flex items-center gap-1.5">
						<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
						<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
						<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
					</div>
					<span class="font-mono text-sm text-white">beyond_code.md</span>
				</div>

				<div class="flex flex-1 flex-col p-6">
					<p class="mb-4 font-mono text-sm">
						<span class="text-matcha">$</span> <span class="text-text">ls ~/hobbies</span>
					</p>

					<div class="flex flex-1 flex-col gap-3">
						{#each beyondCode as item (item.title)}
							<div
								class="group border-border bg-bg hover:border-matcha/60 flex flex-1 items-center gap-4 rounded-lg border px-4 py-3 transition-all duration-300 hover:-translate-y-0.5"
							>
								<span
									class="border-border bg-bg-card flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-2xl transition-transform duration-300 group-hover:scale-110"
									>{item.emoji}</span
								>
								<div>
									<p class="font-bold text-white">{item.title}</p>
									<p class="text-text-muted text-xs">{item.desc}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- 3. EXPERIENCE (from the database): each entry is its own card, side by side -->
			<div
				class="border-border bg-bg-card hover:border-matcha/40 flex flex-col overflow-hidden rounded-xl border shadow-lg transition-colors duration-300 lg:col-span-3"
			>
				<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
					<div class="flex items-center gap-1.5">
						<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
						<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
						<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
					</div>
					<span class="font-mono text-sm text-white">history.log</span>
				</div>

				<div class="p-6 md:p-8">
					<p class="mb-6 font-mono text-sm">
						<span class="text-text font-medium">wahyu</span><span class="text-matcha/90"
							>@portfolio:~$</span
						>
						<span class="text-text">./show_history.sh</span>
					</p>

					{#if experiences.length === 0}
						<p class="text-text-muted font-mono text-sm">Belum ada pengalaman yang ditambahkan.</p>
					{:else}
						<div class="grid gap-5 md:grid-cols-2">
							{#each experiences as exp (exp.id)}
								<div
									class="border-border bg-bg hover:border-matcha/60 flex flex-col gap-3 rounded-lg border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-14px_rgba(138,177,125,0.4)]"
								>
									<!-- Logo (or initials) + date block -->
									<div class="flex items-center gap-3">
										{#if exp.logoUrl}
											<img
												src={exp.logoUrl}
												alt=""
												loading="lazy"
												decoding="async"
												onerror={hideBroken}
												class="border-border bg-bg-card h-11 w-11 shrink-0 rounded-lg border object-contain p-1"
											/>
										{:else}
											<span
												class="border-border bg-bg-card text-matcha flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold"
												aria-hidden="true">{initials(exp.orgName)}</span
											>
										{/if}

										<div
											class="flex min-h-9 flex-1 flex-wrap items-center gap-x-2 rounded-r-lg border-l-4 border-[#d4b9a0] bg-linear-to-r from-[#d4b9a0]/15 to-transparent px-3 py-2 font-mono text-sm text-[#d4b9a0]"
										>
											<span>📅 {period(exp)}</span>
											<span class="text-xs text-[#8f8378]">· {duration(exp)}</span>
										</div>
									</div>

									<div>
										<h4 class="text-lg leading-snug font-bold text-white">{exp.role}</h4>
										<h5 class="text-matcha font-semibold">{exp.orgName}</h5>
									</div>

									<!-- Status first, then type and location -->
									<div class="flex flex-wrap gap-2 font-mono text-[11px]">
										{#if isActive(exp)}
											<span
												class="inline-flex items-center gap-1.5 rounded-md border border-[#27c93f]/45 bg-[#27c93f]/12 px-2 py-0.5 text-[#27c93f]"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-[#27c93f] shadow-[0_0_6px_#27c93f]"
												></span>
												Active
											</span>
										{:else}
											<span
												class="rounded-md border border-[#b794f4]/45 bg-[#b794f4]/12 px-2 py-0.5 text-[#b794f4]"
												>✓ Completed</span
											>
										{/if}
										<span class="border-border bg-bg-card text-text rounded-md border px-2 py-0.5"
											>{typeEmoji[exp.type] ?? '💼'} {typeLabel[exp.type]}</span
										>
										<span
											class="border-border bg-bg-card text-text-muted rounded-md border px-2 py-0.5"
											>{locationEmoji[exp.locationType] ?? '📍'}
											{locationLabel[exp.locationType]}</span
										>
									</div>

									<ul class="space-y-1.5">
										{#each exp.points as point (point)}
											<li class="text-text-muted flex gap-2 text-sm leading-relaxed">
												<span class="text-matcha mt-0.5 font-mono text-xs">&gt;</span>
												{point}
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- 4. TECH STACK: grouped by category, icon tiles -->
			<div
				class="border-border bg-bg-card hover:border-matcha/40 flex flex-col overflow-hidden rounded-xl border shadow-lg transition-colors duration-300 lg:col-span-3"
			>
				<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
					<div class="flex items-center gap-1.5">
						<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
						<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
						<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
					</div>
					<span class="font-mono text-sm text-white">ls_stack/</span>
				</div>

				<div class="p-6 [contain-intrinsic-size:auto_900px] [content-visibility:auto] md:p-8">
					<p class="mb-6 font-mono text-sm">
						<span class="text-text font-medium">wahyu</span><span class="text-matcha/90"
							>@portfolio:~$</span
						>
						<span class="text-text">ls ./stack</span>
					</p>

					<div class="divide-border/70 divide-y">
						{#each stack as group (group.title)}
							<div
								class="grid gap-5 py-6 contain-[layout_paint] first:pt-0 last:pb-0 md:grid-cols-[13rem_1fr]"
							>
								<!-- Category: emoji tile, name, and how many tools it holds -->
								<div class="flex items-center gap-3">
									<span
										class="border-matcha/30 bg-matcha/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl leading-none"
									>
										{group.emoji}
									</span>
									<p class="text-lg leading-none font-bold text-white">
										{group.title}
									</p>
								</div>

								<div class="flex flex-wrap gap-x-3 gap-y-5">
									{#each group.items as tool (tool.name)}
										<div class="flex w-20 flex-col items-center gap-2">
											<div
												class="border-border bg-bg flex h-14 w-14 items-center justify-center rounded-2xl border sm:h-16 sm:w-16"
											>
												<img
													src={tool.icon}
													alt={tool.name}
													width="32"
													height="32"
													loading="lazy"
													decoding="async"
													onerror={hideBroken}
													class="h-7 w-7 sm:h-8 sm:w-8"
												/>
											</div>
											<span class="text-text-muted text-center font-mono text-xs font-medium"
												>{tool.name}</span
											>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
