import { env } from '$env/dynamic/public';

// Falls back to localhost so the build never fails when the variable isn't set yet.
// The replace() strips a trailing slash if one is typed by mistake.
export const SITE_URL = (env.PUBLIC_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
export const SITE_NAME = 'Wahyu Pratama';
export const DEFAULT_TITLE = 'Wahyu Pratama';
export const DEFAULT_DESCRIPTION =
	'Halo, saya Wahyu Pratama. Di sini kamu bisa melihat project, sertifikat, pengalaman, dan tulisan saya.';
export const DEFAULT_OG_IMAGE = '/og.png';
