import type { AuthRecord } from 'pocketbase';

import { pb, setPBCookie, type UsersResponse } from '$lib';
import { userStore } from './user.svelte';

pb.authStore.onChange((token: string, record: AuthRecord) => {
	if (record && pb!.authStore.isValid) {
		try {
			const user = record as UsersResponse;
			userStore.user = user;
			userStore.token = token;

			setPBCookie();
		} catch (error) {
			console.error('Failed to parse user data:', error);
		}
	} else {
		userStore.user = null;
		userStore.token = null;
		// settingsProvider.clear();
		// uiProvider.clear();
	}
}, false);
