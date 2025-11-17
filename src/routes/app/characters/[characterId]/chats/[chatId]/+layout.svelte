<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	import { uiStore } from '$lib';
	import { messagesStore } from '$lib/apps/eventChat/client';

	let { children, data } = $props();

	const chatId = $derived(page.params.chatId);

	afterNavigate(() => {
		if (!page.params.characterId || !page.params.chatId) return;
		uiStore.setChatSettings('', '', page.params.chatId, page.params.characterId, 'friend');
	});

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
