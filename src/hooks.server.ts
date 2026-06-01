import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		// Try to decode the URL pathname
		decodeURI(event.url.pathname);
	} catch (error) {
		console.error('URI malformed error:', error);
		// Redirect to homepage if URL is malformed
		return new Response('Redirect', {
			status: 302,
			headers: { location: '/' }
		});
	}

	return resolve(event);
};
