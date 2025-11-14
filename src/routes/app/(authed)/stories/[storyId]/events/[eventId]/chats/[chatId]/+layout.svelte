<script lang="ts">
	import { page } from '$app/state';

	const storyId = $derived(page.params.storyId);
	const eventId = $derived(page.params.eventId);
	const chatId = $derived(page.params.chatId);

	$effect(() => {
		console.log(storyId, eventId, chatId);
	});
</script>

<div>
	<h1>Chat {chatId}</h1>
</div>
