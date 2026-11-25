<script lang="ts">
	import { GITHUB_USERNAME } from '$lib/data/socials';
	import type { Contributions, Day } from '$lib/server/queries/github';

	let { data }: { data: Contributions } = $props();

	const CELL = 12; // px
	const GAP = 3; // px
	const MONTHS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	// Color ramp for intensity 0-4. Change these hex values to re-theme the whole graph.
	const levels = [
		{ bg: '#352d27', glow: 'none' },
		{ bg: '#1e5a2e', glow: 'none' },
		{ bg: '#2a8a3e', glow: 'none' },
		{ bg: '#27c93f', glow: '0 0 6px rgba(39,201,63,0.45)' },
		{ bg: '#5dff7e', glow: '0 0 9px rgba(93,255,126,0.7)' }
	];

	// Group days into week columns; pad the first week so rows line up with weekdays (Sun = row 0)
	const weeks = $derived.by(() => {
		if (!data.days.length) return [] as (Day | null)[][];

		const cols: (Day | null)[][] = [];
		let col: (Day | null)[] = [];

		const firstWeekday = new Date(data.days[0].date).getUTCDay();
		for (let i = 0; i < firstWeekday; i++) col.push(null);

		for (const day of data.days) {
			col.push(day);
			if (col.length === 7) {
				cols.push(col);
				col = [];
			}
		}
		if (col.length) cols.push(col);
		return cols;
	});

	// One label where the month changes; skip labels that would overlap the next one
	const monthLabels = $derived.by(() => {
		const labels: { index: number; name: string }[] = [];
		let last = -1;

		weeks.forEach((week, i) => {
			const first = week.find((d) => d !== null);
			if (!first) return;
			const month = new Date(first.date).getUTCMonth();
			if (month !== last) {
				labels.push({ index: i, name: MONTHS[month] });
				last = month;
			}
		});

		return labels.filter((l, i) => i === labels.length - 1 || labels[i + 1].index - l.index >= 3);
	});

	// Streaks and busiest day
	const stats = $derived.by(() => {
		const days = data.days;
		let longest = 0;
		let run = 0;
		let best = { count: 0, date: '' };

		for (const d of days) {
			if (d.count > 0) {
				run++;
				longest = Math.max(longest, run);
			} else {
				run = 0;
			}
			if (d.count > best.count) best = { count: d.count, date: d.date };
		}

		// Current streak: walk back from the latest day (today may still be empty)
		let current = 0;
		let i = days.length - 1;
		if (i >= 0 && days[i].count === 0) i--;
		for (; i >= 0 && days[i].count > 0; i--) current++;

		return { longest, current, best };
	});

	const bestDate = $derived(
		stats.best.date
			? new Date(stats.best.date).toLocaleDateString('en', {
					day: 'numeric',
					month: 'short',
					timeZone: 'UTC'
				})
			: '-'
	);

	// Count-up animation for the total
	let shown = $state(0);
	$effect(() => {
		const target = data.total;
		const start = performance.now();
		const duration = 1400;
		let raf = 0;

		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			shown = Math.round(target * (1 - Math.pow(1 - t, 3))); // ease-out cubic
			if (t < 1) raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	const statCards = $derived([
		{ emoji: '📦', label: 'Contributions', value: shown.toLocaleString('en') },
		{ emoji: '🔥', label: 'Current streak', value: `${stats.current} days` },
		{ emoji: '🏆', label: 'Longest streak', value: `${stats.longest} days` },
		{ emoji: '⚡', label: 'Busiest day', value: `${stats.best.count} · ${bestDate}` }
	]);

	// The latest day gets a pulsing ring
	const lastDate = $derived(data.days[data.days.length - 1]?.date);

	// Start scrolled to the most recent weeks (matters on mobile)
	let scroller = $state<HTMLDivElement>();
	$effect(() => {
		if (scroller && weeks.length) scroller.scrollLeft = scroller.scrollWidth;
	});
</script>

<div
	class="group border-border bg-bg-card hover:border-matcha/50 relative overflow-hidden rounded-xl border shadow-xl transition-all duration-300 hover:shadow-[0_15px_40px_-15px_rgba(138,177,125,0.25)]"
>
	<!-- Decorative glows (radial gradients instead of blur filters, much cheaper to render) -->
	<div
		class="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(39,201,63,0.12),transparent_70%)]"
	></div>
	<div
		class="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(138,177,125,0.12),transparent_70%)]"
	></div>

	<div class="relative z-10">
		<!-- Terminal title bar -->
		<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
				<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
				<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
			</div>
			<span class="font-mono text-sm text-white">github-activity.log</span>
		</div>

		<div class="p-6 md:p-8">
			<p class="mb-5 font-mono text-sm">
				<span class="text-text font-medium">wahyu</span><span class="text-matcha/90"
					>@portfolio:~$</span
				>
				<span class="text-text">git contributions --last-year</span>
			</p>

			<!-- Stat cards -->
			<div class="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
				{#each statCards as card, i (card.label)}
					<div
						class="stat border-border/80 bg-bg/60 hover:border-matcha/50 rounded-lg border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5"
						style="--d: {i * 90}ms;"
					>
						<div
							class="text-text-muted mb-1 flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase"
						>
							<span class="text-sm">{card.emoji}</span>
							{card.label}
						</div>
						<div
							class="font-mono text-lg font-bold text-[#5dff7e]"
							style="text-shadow: 0 0 12px rgba(93,255,126,0.35);"
						>
							{card.value}
						</div>
					</div>
				{/each}
			</div>

			<div bind:this={scroller} class="overflow-x-auto pb-2">
				<div class="relative overflow-hidden" style="width: max-content;">
					<!-- One-time light sweep across the graph -->
					<div class="sweep pointer-events-none absolute inset-0 z-10"></div>

					<!-- Month labels -->
					<div
						class="text-text-muted relative mb-2 h-4 font-mono text-[10px]"
						style="width: {weeks.length * (CELL + GAP)}px;"
					>
						{#each monthLabels as m (m.index)}
							<span class="absolute" style="left: {m.index * (CELL + GAP)}px;">{m.name}</span>
						{/each}
					</div>

					<!-- Heatmap: one column per week. The animation runs on the ~53 columns,
					     not on every one of the ~370 cells, which keeps it smooth. -->
					<div class="flex" style="gap: {GAP}px;">
						{#each weeks as week, wi (wi)}
							<div class="week flex flex-col" style="gap: {GAP}px; --d: {wi * 12}ms;">
								{#each week as day, di (di)}
									{#if day}
										<div
											class="cell rounded-[3px] {day.date === lastDate ? 'today' : ''}"
											style="width: {CELL}px; height: {CELL}px; background: {levels[day.level]
												.bg}; box-shadow: {levels[day.level].glow};"
											title="{day.count} contributions on {day.date}"
										></div>
									{:else}
										<div style="width: {CELL}px; height: {CELL}px;"></div>
									{/if}
								{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Footer: GitHub profile card + legend -->
			<div
				class="text-text-muted mt-5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
			>
				<a
					href="https://github.com/{GITHUB_USERNAME}"
					target="_blank"
					rel="noopener noreferrer"
					class="group/link border-border/80 bg-bg/60 hover:border-matcha hover:bg-matcha/10 flex items-center gap-3 rounded-lg border py-2.5 pr-4 pl-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(138,177,125,0.2)]"
				>
					<img
						src="https://github.com/{GITHUB_USERNAME}.png?size=80"
						alt=""
						class="ring-border group-hover/link:ring-matcha h-9 w-9 rounded-full ring-1 transition-all duration-200"
						loading="lazy"
					/>
					<span class="flex flex-col">
						<span class="text-text text-sm font-semibold">@{GITHUB_USERNAME}</span>
						<span
							class="text-text-muted group-hover/link:text-matcha text-[11px] transition-colors duration-200"
						>
							View profile on GitHub
						</span>
					</span>
					<img
						src="/icons/github-light.svg"
						alt=""
						class="ml-2 h-5 w-5 opacity-70 transition-all duration-200 group-hover/link:opacity-100"
					/>
					<span class="text-matcha transition-transform duration-200 group-hover/link:translate-x-1"
						>→</span
					>
				</a>

				<span class="flex items-center gap-1.5">
					Less
					{#each levels as lv (lv.bg)}
						<span class="h-3 w-3 rounded-[3px]" style="background: {lv.bg}; box-shadow: {lv.glow};"
						></span>
					{/each}
					More
				</span>
			</div>
		</div>
	</div>
</div>

<style>
	/* Columns slide in as a left-to-right wave ("backwards" so the hover transform on cells keeps working) */
	.week {
		animation: col-in 0.5s ease-out var(--d, 0ms) backwards;
	}

	.cell {
		transition:
			transform 0.15s ease,
			filter 0.15s ease;
	}
	.cell:hover {
		transform: scale(1.6);
		filter: brightness(1.25);
		position: relative;
		z-index: 20;
	}

	/* Latest day gets a static ring (an infinite box-shadow animation repaints every frame) */
	.today {
		outline: 2px solid rgba(93, 255, 126, 0.65);
		outline-offset: 1px;
	}

	.stat {
		animation: fade-up 0.5s ease-out var(--d, 0ms) backwards;
	}

	.sweep {
		background: linear-gradient(
			90deg,
			transparent 30%,
			rgba(125, 255, 160, 0.2) 50%,
			transparent 70%
		);
		transform: translateX(-100%);
		animation: sweep 1.8s ease-in-out 0.4s forwards;
	}

	@keyframes col-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes sweep {
		to {
			transform: translateX(100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.week,
		.today,
		.stat,
		.sweep {
			animation: none;
		}
	}
</style>
