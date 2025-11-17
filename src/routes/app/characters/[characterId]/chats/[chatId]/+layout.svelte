<script lang="ts">
	import { page } from '$app/state';

	import { chatsStore, messagesStore } from '$lib/apps/eventChat/client';
	import { Collections, pb } from '$lib';

	let { children, data } = $props();

	const chatId = $derived(page.params.chatId);

	$effect(() => {
		if (!chatId) return;

		pb.collection(Collections.Chats)
			.getOne(chatId)
			.then((chat) => {
				chatsStore.setChats([chat]);
			})
			.then(() => {
				messagesStore.load(chatId).then(() => {
					messagesStore.subscribe(chatId);
				});
				return () => {
					messagesStore.unsubscribe();
				};
			});
	});
</script>

<div>
	{@render children()}
</div>
