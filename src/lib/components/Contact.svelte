<script lang="ts">
	import { lang } from '$lib/stores/lang.svelte';
	import { socials, EMAIL } from '$lib/data/socials';
	import { reveal } from '$lib/actions/reveal';

	// Form state
	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let website = $state(''); // honeypot: real visitors never see or fill this

	type Status = 'idle' | 'loading' | 'success' | 'error';
	type ErrorKind = 'validation' | 'rate_limited' | 'failed' | 'network';

	let status = $state<Status>('idle');
	let errorKind = $state<ErrorKind>('failed');
	let retryMinutes = $state(10);

	// "Copy email" button state
	let copied = $state(false);

	// Light checks for UX only; the server validates everything again with Zod
	const emailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
	const canSubmit = $derived(
		name.trim().length >= 2 &&
			emailValid &&
			subject.trim().length >= 3 &&
			message.trim().length >= 10
	);

	const t = $derived(
		lang.value === 'id'
			? {
					send: '📨 ./send',
					sending: 'Mengirim...',
					invalidEmail: 'Format email belum valid',
					success: 'Pesan terkirim! Terima kasih, saya akan membalas lewat email.',
					validation: 'Isian belum sesuai. Periksa lagi nama, email, subjek, dan pesan.',
					failed: 'Pesan gagal dikirim. Coba lagi sebentar lagi atau kirim langsung lewat email.',
					network: 'Koneksi bermasalah. Periksa internetmu lalu coba lagi.',
					rateLimited: (m: number) => `Terlalu banyak pesan. Coba lagi sekitar ${m} menit lagi.`
				}
			: {
					send: '📨 ./send',
					sending: 'Sending...',
					invalidEmail: 'Email format is not valid yet',
					success: "Message sent! Thank you, I'll reply by email.",
					validation: 'Some fields look wrong. Please check name, email, subject, and message.',
					failed: 'Message could not be sent. Try again shortly or email me directly.',
					network: 'Connection problem. Check your internet and try again.',
					rateLimited: (m: number) => `Too many messages. Please try again in about ${m} minutes.`
				}
	);

	const feedback = $derived.by(() => {
		if (status === 'success') return t.success;
		if (status === 'error') {
			return errorKind === 'rate_limited' ? t.rateLimited(retryMinutes) : t[errorKind];
		}
		return '';
	});

	const inputClass =
		'w-full rounded border border-border bg-bg px-3 py-2 text-text placeholder:text-text-muted/50 outline-none transition-colors focus:border-matcha';

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!canSubmit || status === 'loading') return;

		status = 'loading';

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, subject, message, website })
			});
			const data = await res.json().catch(() => null);

			if (res.ok && data?.ok) {
				status = 'success';
				name = '';
				email = '';
				subject = '';
				message = '';
				website = '';
				return;
			}

			if (data?.code === 'validation') errorKind = 'validation';
			else if (data?.code === 'rate_limited') errorKind = 'rate_limited';
			else errorKind = 'failed';

			if (errorKind === 'rate_limited') {
				retryMinutes = Math.max(1, Math.ceil((data?.retryAfter ?? 600) / 60));
			}
			status = 'error';
		} catch {
			errorKind = 'network';
			status = 'error';
		}
	}

	// Clear the success/error banner as soon as the visitor edits the form again
	function handleInput() {
		if (status === 'success' || status === 'error') status = 'idle';
	}

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(EMAIL);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard can be blocked; the mailto button still works
		}
	}
</script>

<section id="contact" class="w-full scroll-mt-6 px-6 py-16 md:px-16 lg:px-24">
	<!-- The reveal animation sits on this inner wrapper so the section itself never moves,
         otherwise anchor links would measure the wrong position -->
	<div use:reveal>
		<h2 class="text-text mb-8 text-2xl font-bold">
			<span class="text-matcha">$</span> ./contact
		</h2>

		<!-- Main grid (left: form, right: cards) -->
		<div class="grid gap-6 md:grid-cols-2">
			<!-- LEFT: terminal-style form -->
			<div
				class="border-border bg-bg-card hover:border-matcha/40 relative flex h-full flex-col overflow-hidden rounded-xl border shadow-lg transition-all duration-300"
			>
				<!-- Decorative Background Glow -->
				<div
					class="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(138,177,125,0.12),transparent_70%)]"
				></div>

				<div class="relative z-10 flex h-full flex-col">
					<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
						<div class="flex items-center gap-1.5">
							<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
							<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
							<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
						</div>
						<span class="font-mono text-sm text-white">contact-form.sh</span>
					</div>

					<form
						onsubmit={handleSubmit}
						oninput={handleInput}
						class="flex flex-1 flex-col gap-4 p-6 text-sm md:p-8"
					>
						<!-- Honeypot: off-screen, skipped by keyboard and screen readers, bots fill it -->
						<div class="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
							<label>
								Website
								<input
									type="text"
									name="website"
									bind:value={website}
									tabindex="-1"
									autocomplete="off"
								/>
							</label>
						</div>

						<!-- Field Name -->
						<label class="flex flex-col gap-1.5">
							<span class="font-mono">
								<span class="text-text font-medium">name</span><span class="text-matcha/90"
									>@client:~$</span
								>
							</span>
							<input
								type="text"
								bind:value={name}
								maxlength="100"
								placeholder="Nama kamu"
								class={inputClass}
							/>
						</label>

						<!-- Field Email -->
						<label class="flex flex-col gap-1.5">
							<span class="font-mono">
								<span class="text-text font-medium">email</span><span class="text-matcha/90"
									>@client:~$</span
								>
							</span>
							<input
								type="email"
								bind:value={email}
								maxlength="254"
								placeholder="kamu@email.com"
								class={inputClass}
							/>
							{#if email && !emailValid}
								<span class="text-xs text-[#ff5f56]">{t.invalidEmail}</span>
							{/if}
						</label>

						<!-- Field Subject -->
						<label class="flex flex-col gap-1.5">
							<span class="font-mono">
								<span class="text-text font-medium">subject</span><span class="text-matcha/90"
									>@client:~$</span
								>
							</span>
							<input
								type="text"
								bind:value={subject}
								maxlength="150"
								placeholder="Tentang apa?"
								class={inputClass}
							/>
						</label>

						<!-- Field Message -->
						<label class="flex flex-1 flex-col gap-1.5">
							<span class="font-mono">
								<span class="text-text font-medium">message</span><span class="text-matcha/90"
									>@client:~$</span
								>
							</span>
							<textarea
								bind:value={message}
								maxlength="5000"
								placeholder="Tulis pesanmu (minimal 10 karakter)..."
								class="{inputClass} h-full min-h-30 resize-none"></textarea>
						</label>

						<!-- Submit button + feedback -->
						<div class="mt-2 flex flex-wrap items-center gap-3">
							<button
								type="submit"
								disabled={!canSubmit || status === 'loading'}
								aria-busy={status === 'loading'}
								class="border-matcha/50 bg-bg/50 text-matcha enabled:hover:bg-matcha enabled:hover:text-bg flex cursor-pointer items-center gap-2 rounded-md border px-5 py-2.5 font-bold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
							>
								{#if status === 'loading'}
									<span
										class="border-matcha/30 border-t-matcha h-4 w-4 animate-spin rounded-full border-2"
									></span>
									{t.sending}
								{:else}
									{t.send}
								{/if}
							</button>

							<div aria-live="polite">
								{#if status === 'success'}
									<p
										class="rounded-md border border-[#27c93f]/40 bg-[#27c93f]/10 px-3 py-2 font-mono text-xs text-[#27c93f]"
									>
										✅ {feedback}
									</p>
								{:else if status === 'error'}
									<p
										class="rounded-md border border-[#ff5f56]/40 bg-[#ff5f56]/10 px-3 py-2 font-mono text-xs text-[#ff5f56]"
									>
										⚠️ {feedback}
									</p>
								{/if}
							</div>
						</div>
					</form>
				</div>
			</div>

			<!-- RIGHT: quick link cards. The glowing bottom line grows from left to right on hover. -->
			<div class="grid h-full grid-cols-2 gap-4">
				{#each socials as link (link.name)}
					<a
						href={link.href}
						target={link.href.startsWith('mailto:') ? undefined : '_blank'}
						rel="noopener noreferrer"
						class="group border-border bg-bg-card hover:border-matcha/60 relative flex h-full flex-col gap-2 overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5"
					>
						<span class="text-2xl">{link.emoji}</span>
						<span class="text-text font-semibold">{link.name}</span>
						<span class="text-text-muted text-xs">{link.desc}</span>
						<span class="text-matcha mt-auto text-sm">
							{link.action}
							<span class="inline-block transition-transform duration-300 group-hover:translate-x-1"
								>→</span
							>
						</span>

						<span
							class="bg-matcha absolute bottom-0 left-0 h-0.5 w-0 shadow-[0_0_10px_var(--color-matcha)] transition-all duration-500 group-hover:w-full"
						></span>
					</a>
				{/each}
			</div>
		</div>

		<!-- BOTTOM: availability card, styled as a status.json terminal window -->
		<div
			class="border-border bg-bg-card hover:border-matcha/40 relative mt-6 w-full overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_-10px_rgba(138,177,125,0.45)]"
		>
			<!-- Light that runs along the top and bottom edges (same glowing-line idea as the cards above) -->
			<span class="edge-light edge-top" aria-hidden="true"></span>
			<span class="edge-light edge-bottom" aria-hidden="true"></span>

			<div class="relative">
				<div class="border-border bg-bg-nav flex items-center gap-3 border-b px-4 py-3">
					<div class="flex items-center gap-1.5">
						<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
						<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
						<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
					</div>
					<span class="font-mono text-sm text-white">status.json</span>
				</div>

				<div class="grid gap-8 p-6 md:grid-cols-2 md:p-8">
					<!-- Left: the pitch -->
					<div class="flex flex-col justify-center gap-5">
						<span
							class="inline-flex w-fit items-center gap-2 rounded-full border border-[#27c93f]/40 bg-[#27c93f]/10 px-3 py-1 font-mono text-xs font-bold text-[#27c93f]"
						>
							<span class="relative flex h-2 w-2">
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#27c93f] opacity-75"
								></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-[#27c93f]"></span>
							</span>
							Open to Work
						</span>

						<h3 class="text-2xl leading-tight font-bold text-white md:text-3xl">
							Punya proyek atau lowongan?<br />
							<span class="text-matcha">Ayo ngobrol.</span>
						</h3>

						<p class="text-text-muted leading-relaxed">
							Saya terbuka untuk posisi freelance di bidang backend. Kirim detailnya lewat form di
							atas, atau langsung ke email.
						</p>

						<div class="flex flex-wrap gap-3">
							<a
								href={`mailto:${EMAIL}`}
								class="group bg-matcha text-bg hover:bg-matcha-glow relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(138,177,125,0.4)] active:scale-95"
							>
								<span
									class="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
								></span>
								<span class="relative">✉️ Kirim Email</span>
							</a>

							<button
								type="button"
								onclick={copyEmail}
								class="border-border bg-bg hover:border-matcha inline-flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
							>
								{copied ? '✅ Tersalin!' : '📋 Salin Email'}
							</button>
						</div>
					</div>

					<!-- Right: the same info as a JSON file -->
					<div
						class="border-border bg-bg hover:border-matcha/50 rounded-lg border p-5 font-mono text-sm leading-relaxed transition-colors duration-300"
					>
						<p class="mb-3">
							<span class="text-text font-medium">wahyu</span><span class="text-matcha/90"
								>@portfolio:~$</span
							>
							<span class="text-text">cat status.json</span>
						</p>

						<div class="text-text-muted">&#123;</div>
						<div class="pl-5">
							<span class="text-text">"name"</span>:
							<span class="text-matcha">"Wahyu Pratama"</span>,
						</div>
						<div class="pl-5">
							<span class="text-text">"timezone"</span>:
							<span class="text-matcha">"Asia/Jakarta (UTC+7)"</span>,
						</div>
						<div class="pl-5">
							<span class="text-text">"languages"</span>: [<span class="text-matcha"
								>"Indonesia"</span
							>,
							<span class="text-matcha">"English"</span>],
						</div>
						<div class="pl-5">
							<span class="text-text">"reply_time"</span>:
							<span class="text-matcha">"&lt; 24 jam"</span>,
						</div>
						<div class="pl-5">
							<span class="text-text">"currently"</span>:
							<span class="text-matcha">"building & learning"</span>
						</div>
						<div class="text-text-muted">
							&#125;
							<span
								class="bg-matcha ml-1 inline-block h-3.5 w-2 animate-pulse align-middle shadow-[0_0_8px_#8ab17d]"
							></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
