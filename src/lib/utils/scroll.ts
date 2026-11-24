// Same value as the scroll-mt-6 class on the sections (24px): the heading lands just under the navbar
const OFFSET = 24;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToTop() {
	window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

// Smooth-scrolls to a section by id. Returns false if the section is not on this page.
export function scrollToSection(id: string): boolean {
	const el = document.getElementById(id);
	if (!el) return false;

	const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
	window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
	return true;
}
