import { json, type RequestHandler } from '@sveltejs/kit';
import { contactSchema } from '$lib/server/contact-schema';
import { checkRateLimit } from '$lib/server/rate-limit';
import { sendContactEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false, code: 'bad_request' }, { status: 400 });
	}

	if (typeof body !== 'object' || body === null) {
		return json({ ok: false, code: 'bad_request' }, { status: 400 });
	}
	const data = body as Record<string, unknown>;

	// 1. Honeypot: a filled hidden field means a bot. Pretend success and send nothing.
	if (typeof data.website === 'string' && data.website.trim() !== '') {
		return json({ ok: true });
	}

	// 2. Rate limit: 3 messages per 10 minutes per IP
	const limit = await checkRateLimit(getClientAddress());
	if (!limit.ok) {
		return json(
			{ ok: false, code: 'rate_limited', retryAfter: limit.retryAfter },
			{ status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
		);
	}

	// 3. Validate again on the server, never trust the browser
	const parsed = contactSchema.safeParse(data);
	if (!parsed.success) {
		return json({ ok: false, code: 'validation' }, { status: 400 });
	}

	// 4. Send the email through Resend
	try {
		await sendContactEmail(parsed.data);
		return json({ ok: true });
	} catch (err) {
		console.error('Failed to send contact email:', err);
		return json({ ok: false, code: 'send_failed' }, { status: 502 });
	}
};
