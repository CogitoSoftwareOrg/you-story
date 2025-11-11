<script>
	import { goto } from '$app/navigation';

	import { userStore } from '$lib/apps/user/client';
	import ThemeController from '$lib/shared/ui/ThemeController.svelte';

	const { children } = $props();

	$effect(() => {
		const user = userStore.user;
		if (!user) {
			goto('/app/auth');
		}
	});

	$effect(() => {
		const userId = userStore.user?.id;
		if (userId) userStore.subscribe(userId);
		return () => userStore.unsubscribe();
	});
</script>

<ThemeController />
{@render children()}
