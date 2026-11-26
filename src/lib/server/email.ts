import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import type { ContactInput } from './contact-schema';

// Everything from the visitor is escaped before it goes into the HTML template
const escapeHtml = (s: string) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

function buildHtml({ name, email, subject, message }: ContactInput) {
	const n = escapeHtml(name);
	const e = escapeHtml(email);
	const s = escapeHtml(subject);
	const m = escapeHtml(message).replace(/\r?\n/g, '<br>');

	return `
<div style="background:#f4f1ec;padding:24px;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5dfd6;border-radius:12px;overflow:hidden;">
    <div style="background:#1c1815;padding:16px 24px;font-family:'SFMono-Regular',Consolas,monospace;font-size:14px;">
      <span style="color:#8ab17d;">$</span>
      <span style="color:#e6dfd5;"> new_message --from portfolio</span>
    </div>
    <div style="padding:24px;color:#2b2622;">
      <h2 style="margin:0 0 16px;font-size:18px;">${s}</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:4px 16px 4px 0;color:#8a8076;">Nama</td>
          <td style="padding:4px 0;font-weight:600;">${n}</td>
        </tr>
        <tr>
          <td style="padding:4px 16px 4px 0;color:#8a8076;">Email</td>
          <td style="padding:4px 0;"><a href="mailto:${e}" style="color:#4f7a43;">${e}</a></td>
        </tr>
      </table>
      <div style="margin-top:20px;padding:16px;background:#f7f5f1;border-left:3px solid #8ab17d;border-radius:4px;font-size:15px;line-height:1.6;">${m}</div>
      <p style="margin:24px 0 0;font-size:12px;color:#8a8076;">Tekan Reply untuk membalas langsung ke ${e}.</p>
    </div>
  </div>
</div>`;
}

export async function sendContactEmail(input: ContactInput) {
	if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
		throw new Error('RESEND_API_KEY / CONTACT_TO_EMAIL are not set');
	}

	const resend = new Resend(env.RESEND_API_KEY);
	const { name, email, subject, message } = input;

	const { error } = await resend.emails.send({
		from: env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
		to: env.CONTACT_TO_EMAIL,
		// One click on Reply in Gmail goes straight to the visitor
		replyTo: email,
		subject: `[Portfolio] ${subject}`,
		html: buildHtml(input),
		text: `Pesan baru dari portofolio\n\nNama: ${name}\nEmail: ${email}\nSubjek: ${subject}\n\n${message}`
	});

	if (error) throw new Error(`Resend error: ${error.message}`);
}
