<script lang="ts">
	import { page } from '$app/state';
	import { messagesStore } from '$lib/apps/eventChat/client/messages.svelte.js';

	let { children, data } = $props();

	const chatId = $derived(page.params.chatId);

	$effect(() => {
		if (!chatId) return;
		messagesStore.load(chatId).then(() => {
			messagesStore.subscribe(chatId);
		});

		return () => {
			messagesStore.unsubscribe();
		};
	});
</script>

<div>
	{@render children()}
</div>
