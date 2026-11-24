export const EMAIL = 'wahyupratama110107@gmail.com';
export const GITHUB_USERNAME = 'WahyuPratama222';

export type Social = {
	name: string;
	slug: string; // Simple Icons slug
	emoji: string;
	desc: string;
	action: string;
	href: string;
	inHero: boolean; // show in the Hero "Connect" row
};

export const socials: Social[] = [
	{
		name: 'Email',
		slug: 'gmail',
		emoji: '📧',
		desc: 'Kirim email langsung',
		action: 'Send Email',
		href: `mailto:${EMAIL}`,
		inHero: false
	},
	{
		name: 'LinkedIn',
		slug: 'linkedin',
		emoji: '💼',
		desc: 'Terhubung secara profesional',
		action: 'View Profile',
		href: 'https://www.linkedin.com/in/wahyu-pratama-ptm',
		inHero: true
	},
	{
		name: 'GitHub',
		slug: 'github',
		emoji: '🚀',
		desc: 'Lihat repository saya',
		action: 'View Repos',
		href: 'https://github.com/WahyuPratama222',
		inHero: true
	},
	{
		name: 'Instagram',
		slug: 'instagram',
		emoji: '📸',
		desc: 'Keseharian di luar kode',
		action: 'Follow Me',
		href: 'https://www.instagram.com/wahyu0020',
		inHero: true
	}
];
