import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' })
	],
	// Pe Windows, binding implicit pe ::1 poate face ca http://127.0.0.1:5173 să eșueze;
	// host: true ascultă pe toate interfețele (inclusiv IPv4).
	server: {
		host: true,
		port: 5173,
		strictPort: true
	}
});
