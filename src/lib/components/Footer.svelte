<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer
	class="border-border/50 bg-bg-nav/95 relative mt-auto w-full border-t pt-6 pb-6 text-sm backdrop-blur-md"
>
	<!-- Efek Garis Menyala (Glow Line) tipis di atas footer -->
	<div
		class="via-matcha/30 absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent to-transparent"
	></div>

	<div class="mx-auto flex w-full max-w-5xl items-center justify-between px-6 md:px-8">
		<!-- Kiri: Terminal Penutup -->
		<div
			class="group text-text-muted hover:text-text flex items-center gap-2 font-mono text-sm font-medium transition-colors"
		>
			<span class="text-matcha">wahyu@portfolio:~$</span>
			<span class="text-text">exit</span>
			<span class="bg-matcha inline-block h-3.5 w-2 animate-pulse shadow-[0_0_8px_#8ab17d]"></span>
		</div>

		<!-- Kanan: Copyright dengan Efek Hover Garis Membesar (Mirip Header) -->
		<a
			href="#home"
			class="group text-text-muted hover:text-text relative py-1 font-mono text-sm transition-colors duration-200"
		>
			&copy; {currentYear} Wahyu Pratama.
			<!-- Garis bawah yang melebar dari tengah saat di-hover -->
			<span
				class="bg-matcha absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 shadow-[0_0_8px_var(--color-matcha)] transition-all duration-300 group-hover:w-full"
			></span>
		</a>
	</div>
</footer>
