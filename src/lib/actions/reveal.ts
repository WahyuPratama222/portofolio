// Svelte action: fades an element in (and slides it up) the first time it scrolls into view.
// Usage: <section use:reveal> or <div use:reveal={{ delay: 120 }}>
export function reveal(node: HTMLElement, options: { delay?: number } = {}) {
	if (typeof IntersectionObserver === 'undefined') return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// Already on screen at load: leave it alone, otherwise it would flash hidden then visible
	if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;

	node.classList.add('reveal');
	if (options.delay) node.style.transitionDelay = `${options.delay}ms`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('revealed');
				observer.disconnect();
			}
		},
		{ threshold: 0.12 }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
