import { browser } from '$app/environment';
import { PUBLIC_PB_URL } from '$env/static/public';
import PocketBase, { AsyncAuthStore } from 'pocketbase';

import type { TypedPocketBase } from './pocketbase-types';

const store = new AsyncAuthStore({
	initial: browser ? (localStorage.getItem('pb_auth') ?? undefined) : undefined,
	save: async (s) => (browser ? localStorage.setItem('pb_auth', s) : Promise.resolve()),
	clear: async () => (browser ? localStorage.removeItem('pb_auth') : Promise.resolve())
});

export const pb = new PocketBase(PUBLIC_PB_URL, store) as TypedPocketBase;

pb.autoCancellation(true);
if (!browser) pb.autoCancellation(false);
