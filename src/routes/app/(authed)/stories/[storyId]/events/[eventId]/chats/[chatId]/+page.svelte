<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { eventChatsStore } from '$lib/apps/eventChat/client';
	import { Button } from '$lib/shared/ui';
	import { ArrowLeft, Save, MessageCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import {
		type EventChatsResponse,
		EventChatsCommitModeOptions,
		EventChatsStatusOptions
	} from '$lib';

	const storyId = $derived(page.params.storyId);
	const eventId = $derived(page.params.eventId);
	const chatId = $derived(page.params.chatId);

	// Chat state
	let chat = $state<EventChatsResponse | null>(null);
	let povCharacter = $state<string>('');
	let commitMode = $state<EventChatsCommitModeOptions>(EventChatsCommitModeOptions.autoCommit);
	let status = $state<EventChatsStatusOptions>(EventChatsStatusOptions.inProgress);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Load chat data
	onMount(async () => {
		if (!chatId) {
			isLoading = false;
			return;
		}

		try {
			const loadedChat = await eventChatsStore.getById(chatId);
			chat = loadedChat;
			povCharacter = loadedChat.povCharacter ?? '';
			commitMode = loadedChat.commitMode ?? EventChatsCommitModeOptions.autoCommit;
			status = loadedChat.status ?? EventChatsStatusOptions.inProgress;
		} catch (error) {
			console.error('Failed to load chat:', error);
		} finally {
			isLoading = false;
		}
	});

	function handleBack() {
		goto(`/app/stories/${storyId}/events/${eventId}/chats`);
	}

	async function handleSaveChat() {
		if (!chat || isSaving) return;

		isSaving = true;

		try {
			await eventChatsStore.update(chat.id, {
				povCharacter,
				commitMode,
				status
			});
		} catch (error) {
			console.error('Failed to update chat:', error);
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="flex h-[calc(100vh-4rem)] gap-6 p-3">
	<!-- Left Side: Chat Editor -->
	<div
		class="flex w-96 flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-base-300 p-6">
			<div class="flex items-center gap-3">
				<Button onclick={handleBack} size="md" style="solid" circle>
					<ArrowLeft class="size-5" />
				</Button>
				<h2 class="text-xl font-semibold text-base-content">Chat Settings</h2>
			</div>
			<Button onclick={handleSaveChat} size="md" color="primary" disabled={isSaving}>
				{#if isSaving}
					<span class="loading loading-sm loading-spinner"></span>
				{:else}
					<Save class="size-4" />
				{/if}
				<span>Save</span>
			</Button>
		</div>

		<!-- Form Content -->
		<div class="flex-1 overflow-y-auto p-6">
			{#if isLoading}
				<div class="flex h-full items-center justify-center">
					<span class="loading loading-lg loading-spinner"></span>
				</div>
			{:else if chat}
				<div class="space-y-4">
					<!-- Status -->
					<!-- <div class="form-control">
						<label class="label" for="chat-status-select">
							<span class="label-text font-semibold">Status</span>
						</label>
						<select
							bind:value={status}
							id="chat-status-select"
							class="select-bordered select w-full"
						>
							{#each statusOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div> -->

					<!-- Commit Mode -->
					<!-- <div class="form-control">
						<label class="label" for="chat-commit-mode-select">
							<span class="label-text font-semibold">Commit Mode</span>
						</label>
						<select
							bind:value={commitMode}
							id="chat-commit-mode-select"
							class="select-bordered select w-full"
						>
							{#each commitModeOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div> -->

					<!-- Chat Info -->
					<div class="rounded-lg border border-base-300 bg-base-100 p-4">
						<h4 class="mb-2 text-sm font-semibold text-base-content">Chat Info</h4>
						<div class="space-y-1 text-xs text-base-content/60">
							<p>ID: {chat.id}</p>
							<p>Created: {new Date(chat.created).toLocaleString()}</p>
							<p>Updated: {new Date(chat.updated).toLocaleString()}</p>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex h-full items-center justify-center text-base-content/60">
					Chat not found
				</div>
			{/if}
		</div>
	</div>

	<!-- Right Side: Chat Interface -->
	<div
		class="flex flex-1 flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm"
	>
		<!-- Chat Header -->
		<div class="border-b border-base-300 p-6">
			<div class="flex items-center gap-3">
				<MessageCircle class="size-6 text-primary" />
				<div>
					<h3 class="text-lg font-semibold text-base-content">Chat</h3>
					{#if chat}
						<p class="text-xs text-base-content/60">Chat #{chat.id.slice(-6)}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Chat Messages Area -->
		<div class="flex-1 overflow-y-auto p-6">
			<div
				class="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-base-300 bg-base-100 p-8"
			>
				<div class="text-center">
					<div class="mb-4 inline-flex rounded-full bg-base-200 p-6">
						<MessageCircle class="size-12 text-base-content/50" />
					</div>
					<h4 class="mb-2 text-lg font-semibold text-base-content">Chat Interface Coming Soon</h4>
					<p class="text-sm text-base-content/60">
						This is where the chat interface will be implemented.<br />
						Messages, AI responses, and interactive storytelling will happen here.
					</p>
				</div>
			</div>
		</div>

		<!-- Chat Input Area -->
		<div class="border-t border-base-300 p-4">
			<div class="flex gap-2">
				<input
					type="text"
					placeholder="Type your message... (coming soon)"
					class="input-bordered input flex-1"
					disabled
				/>
				<Button size="md" color="primary" disabled>
					<span>Send</span>
				</Button>
			</div>
		</div>
	</div>
</div>
