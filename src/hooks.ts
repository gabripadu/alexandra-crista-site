import type { Reroute } from '@sveltejs/kit';
import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute: Reroute = ({ url }) => deLocalizeUrl(url).pathname;

/** Folosit de SvelteKit pentru tipuri RPC; lăsăm obiect gol dacă nu folosești transport. */
export const transport = {};
