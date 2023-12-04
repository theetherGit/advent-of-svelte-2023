import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { join } from 'node:path';
import { partytownVite } from '@builder.io/partytown/utils';

export default defineConfig({
	plugins: [
		sveltekit(),
		partytownVite({
			// `dest` specifies where files are copied to in production
			dest: join(process.cwd(), 'static', '~partytown')
		})
	]
});
