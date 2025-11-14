<script lang="ts">
	import { eventChatsStore } from './eventChats.svelte';
	import EventChatCard from './EventChatCard.svelte';
	import { Button } from '$lib/shared/ui';
	import { Plus } from 'lucide-svelte';

	interface Props {
		eventId: string;
		selectedChatId?: string | null;
		onChatSelect?: (chatId: string) => void;
		onCreateChat?: () => void;
	}

	let { eventId, selectedChatId = null, onChatSelect, onCreateChat }: Props = $props();

	const eventChats = $derived(eventChatsStore.getEventChats(eventId));
	const canCreate = $derived(eventChatsStore.canCreateNewChat(eventId));
</script>

<div class="flex h-full flex-col gap-4">
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-semibold text-base-content">Event Chats</h3>
		{#if canCreate}
			<Button onclick={onCreateChat} size="sm" color="primary">
				<Plus class="size-4" />
				<span>New Chat</span>
			</Button>
		{/if}
	</div>

	<div class="flex-1 space-y-2 overflow-y-auto">
		{#if eventChats.length === 0}
			<div
				class="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-base-300 bg-base-100 p-8 text-center"
			>
				<div class="mb-4 rounded-full bg-base-200 p-4">
					<Plus class="size-8 text-base-content/50" />
				</div>
				<h4 class="mb-2 text-lg font-semibold text-base-content">No chats yet</h4>
				<p class="mb-4 text-sm text-base-content/60">
					Create your first chat to start exploring this event
				</p>
				{#if canCreate}
					<Button onclick={onCreateChat} size="md" color="primary">
						<Plus class="size-4" />
						<span>Create First Chat</span>
					</Button>
				{/if}
			</div>
		{:else}
			{#each eventChats as chat (chat.id)}
				<EventChatCard
					{chat}
					isActive={selectedChatId === chat.id}
					onclick={() => onChatSelect?.(chat.id)}
				/>
			{/each}

			{#if !canCreate}
				<div class="rounded-lg border border-warning bg-warning/10 p-3">
					<p class="text-xs text-warning">
						Complete or fix current chats before creating a new one
					</p>
				</div>
			{/if}
		{/if}
	</div>
</div>
