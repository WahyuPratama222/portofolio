<script lang="ts">
	let { href, label }: { href: string; label: string } = $props();
</script>

<!-- White label; only the "$" and the arrow stay matcha. On hover the button fills with matcha. -->
<a
	{href}
	class="group border-matcha/50 bg-bg-card hover:border-matcha hover:bg-matcha hover:text-bg relative inline-flex items-center gap-3 overflow-hidden rounded-lg border px-6 py-3 font-mono text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(138,177,125,0.35)] active:scale-95"
>
	<!-- Light sweep across the button on hover -->
	<span
		class="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
	></span>

	<span class="text-matcha group-hover:text-bg relative transition-colors duration-300">$</span>
	<span class="relative">{label}</span>
	<span
		class="text-matcha group-hover:text-bg relative inline-block transition-all duration-300 group-hover:translate-x-1.5"
		>→</span
	>
</a>
