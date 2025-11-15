<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import { storiesStore, StoryHeader, StoryForm, storiesApi } from '$lib/apps/story/client';
	import {
		storyEventsStore,
		EventForm,
		StoryEventsTimeline,
		storyEventsApi
	} from '$lib/apps/storyEvent/client';
	import { Button } from '$lib/shared/ui';
	import { Save, ExternalLink, X } from 'lucide-svelte';
	import { nanoid } from '$lib/shared';
	import type { StoryBible } from '$lib/apps/story/core/models';
	const storyId = $derived(page.params.storyId);
	const story = $derived(storiesStore.stories.find((s) => s.id === storyId));

	// State for selected event
	let selectedEventId = $state<string | null>(null);
	const selectedEvent = $derived(
		selectedEventId ? storyEventsStore.storyEvents.find((e) => e.id === selectedEventId) : null
	);

	// State for creating new event
	let isCreatingNew = $state(false);
	let prevEventForNew = $state<typeof selectedEvent>(null);
	let nextEventForNew = $state<typeof selectedEvent>(null);

	// Story form state
	let storyName = $state('');
	let storyDescription = $state('');
	let storyStyleText = $state('');
	let storyWorldFactsText = $state('');
	let storyCoverFile = $state<File | null>(null);
	let storyCoverPreview = $state<string | null>(null);
	let isStoryDirty = $state(false);

	// Event form state
	let eventName = $state('');
	let eventDescription = $state('');
	let eventCharacters = $state<string[]>([]);
	let isEventDirty = $state(false);

	// Saving states
	let isSavingStory = $state(false);
	let isSavingEvent = $state(false);

	// Refs to form components for resetting dirty tracking
	interface FormComponent {
		resetDirtyTracking(): void;
	}
	let storyFormRef: FormComponent | null = $state(null);
	let eventFormRef: FormComponent | null = $state(null);

	// Track current story/event IDs for dirty reset
	let currentStoryId = $state<string | null>(null);
	let currentEventId = $state<string | null>(null);
	let currentIsCreatingNew = $state(false);

	// Sync story data when story changes
	$effect(() => {
		if (story) {
			const needsReset = currentStoryId !== story.id;

			storyName = story.name ?? '';
			storyDescription = story.description ?? '';
			storyCoverPreview = storiesStore.getCoverUrl(story);

			const bible = story.bible as StoryBible | null;
			if (bible) {
				storyStyleText = bible.style?.join('\n') ?? '';
				storyWorldFactsText = bible.worldFacts?.join('\n') ?? '';
			}

			// Reset dirty tracking when story changes
			if (needsReset) {
				currentStoryId = story.id;
				// Use setTimeout to ensure form ref is available and data is set
				setTimeout(() => {
					if (storyFormRef) {
						storyFormRef.resetDirtyTracking();
					}
				}, 0);
			}
		}
	});

	// Sync event data when selected event changes
	$effect(() => {
		if (selectedEvent && !isCreatingNew) {
			const needsReset = currentEventId !== selectedEvent.id || currentIsCreatingNew;

			eventName = selectedEvent.name ?? '';
			eventDescription = selectedEvent.description ?? '';
			eventCharacters = selectedEvent.characters ?? [];

			// Reset dirty tracking when event changes
			if (needsReset) {
				currentEventId = selectedEvent.id;
				currentIsCreatingNew = false;
				// Use setTimeout to ensure form ref is available and data is set
				setTimeout(() => {
					if (eventFormRef) {
						eventFormRef.resetDirtyTracking();
					}
				}, 0);
			}
		} else if (isCreatingNew) {
			const needsReset = !currentIsCreatingNew;

			// Reset form for new event
			eventName = '';
			eventDescription = '';
			eventCharacters = [];

			// Reset dirty tracking for new event
			if (needsReset) {
				currentIsCreatingNew = true;
				currentEventId = null;
				// Use setTimeout to ensure form ref is available and data is set
				setTimeout(() => {
					if (eventFormRef) {
						eventFormRef.resetDirtyTracking();
					}
				}, 0);
			}
		}
	});

	// Reset dirty states when switching between forms
	$effect(() => {
		if (isStoryMode) {
			isEventDirty = false;
		} else {
			isStoryDirty = false;
		}
	});

	function handleEventSelect(eventId: string | null) {
		selectedEventId = eventId;
		isCreatingNew = false;
		prevEventForNew = null;
		nextEventForNew = null;
		// Dirty will be reset in $effect when event data syncs
	}

	function handleCreateEvent(prevEvent: typeof selectedEvent, nextEvent: typeof selectedEvent) {
		isCreatingNew = true;
		prevEventForNew = prevEvent;
		nextEventForNew = nextEvent;
		selectedEventId = prevEvent?.id ?? null;

		// Reset form
		eventName = '';
		eventDescription = '';
		eventCharacters = [];
	}

	function handleGoToEvent() {
		if (selectedEventId) {
			goto(`/app/stories/${storyId}/events/${selectedEventId}/chats`);
		}
	}

	async function handleSaveStory() {
		if (!story || isSavingStory) return;

		isSavingStory = true;

		const bible: StoryBible = {
			style: storyStyleText
				.split('\n')
				.map((s) => s.trim())
				.filter(Boolean),
			worldFacts: storyWorldFactsText
				.split('\n')
				.map((s) => s.trim())
				.filter(Boolean)
		};

		try {
			await storiesApi.update(story.id, {
				name: storyName,
				description: storyDescription,
				cover: storyCoverFile ?? undefined,
				bible
			});

			// Reset dirty tracking after successful save
			if (storyFormRef) {
				storyFormRef.resetDirtyTracking();
				isStoryDirty = false;
			}
			storyCoverFile = null; // Clear cover file after save
		} catch (error) {
			console.error('Failed to update story:', error);
		} finally {
			isSavingStory = false;
		}
	}

	async function handleSaveEvent() {
		if (isSavingEvent) return;

		isSavingEvent = true;

		try {
			if (isCreatingNew) {
				// Create new event
				if (!storyId) return;

				const prevOrder = prevEventForNew ? (prevEventForNew.order ?? 0) : 0;
				const nextOrder = nextEventForNew ? (nextEventForNew.order ?? 0) : null;

				let order: number;
				if (prevEventForNew && nextEventForNew && nextOrder !== null) {
					order = (prevOrder + nextOrder) / 2;
				} else if (prevEventForNew) {
					order = prevOrder + 1;
				} else if (nextEventForNew && nextOrder !== null) {
					order = nextOrder > 0 ? nextOrder - 1 : 0;
				} else {
					order = 0;
				}

				const id = nanoid();

				await storyEventsApi.create(
					{
						id,
						story: storyId,
						name: eventName,
						description: eventDescription,
						characters: eventCharacters,
						order
					},
					prevEventForNew?.id,
					nextEventForNew?.id
				);

				// Reset state after creation
				isCreatingNew = false;
				prevEventForNew = null;
				nextEventForNew = null;
				selectedEventId = null;
				isEventDirty = false;
			} else if (selectedEvent) {
				// Update existing event
				await storyEventsApi.update(selectedEvent.id, {
					name: eventName,
					description: eventDescription,
					characters: eventCharacters
				});

				// Reset dirty tracking after successful save
				if (eventFormRef) {
					eventFormRef.resetDirtyTracking();
					isEventDirty = false;
				}
			}
		} catch (error) {
			console.error('Failed to save event:', error);
		} finally {
			isSavingEvent = false;
		}
	}

	function handleCloseEventPreview() {
		selectedEventId = null;
		isCreatingNew = false;
		prevEventForNew = null;
		nextEventForNew = null;
		isEventDirty = false;
		// Story form dirty tracking will reset when story mode becomes active
	}

	const isStoryMode = $derived(selectedEventId === null && !isCreatingNew);
	const isEventMode = $derived(!isStoryMode);
	const showSaveButton = $derived(
		(isStoryMode && isStoryDirty) || (isEventMode && (isEventDirty || isCreatingNew))
	);
</script>

<div class="flex h-[calc(100vh-4rem)] flex-col gap-4 p-3 md:flex-row md:gap-6 md:p-6">
	<!-- Left Side: Story Info + Events Timeline -->
	<div class="flex w-full flex-col gap-4 md:w-96 md:gap-6">
		<!-- Story Header -->
		<div class="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm md:p-6">
			{#if story}
				<StoryHeader {story} onclick={handleCloseEventPreview} />
			{/if}
		</div>

		<!-- Events Timeline -->
		<div
			class="flex-1 overflow-hidden rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm md:p-6"
		>
			{#if storyId}
				<StoryEventsTimeline
					{storyId}
					{selectedEventId}
					{isCreatingNew}
					onEventSelect={handleEventSelect}
					onCreateEvent={handleCreateEvent}
				/>
			{/if}
		</div>
	</div>

	<!-- Right Side: Editable Form -->
	<div
		class="flex w-full flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm md:flex-2"
	>
		<!-- Form Header -->
		<div
			class="flex flex-col gap-3 border-b border-base-300 p-4 md:flex-row md:items-center md:justify-between md:p-6"
		>
			<h2 class="text-lg font-semibold text-base-content md:text-xl">
				{#if isStoryMode}
					Story Details
				{:else if isCreatingNew}
					Create New Event
				{:else}
					Event Preview
				{/if}
			</h2>
			<div class="flex flex-wrap items-center gap-2">
				{#if isEventMode}
					<Button onclick={handleCloseEventPreview} size="md" style="solid" circle>
						<X class="size-5 md:size-6" />
					</Button>
					{#if selectedEventId && !isCreatingNew}
						<Button
							onclick={handleGoToEvent}
							size="md"
							style="solid"
							color="primary"
							class="flex-1 md:flex-initial"
						>
							<ExternalLink class="size-4" />
							<span class="hidden sm:inline">Open Event</span>
							<span class="sm:hidden">Open</span>
						</Button>
					{/if}
				{/if}
				{#if showSaveButton}
					<Button
						onclick={isStoryMode ? handleSaveStory : handleSaveEvent}
						size="md"
						color="primary"
						disabled={isStoryMode ? isSavingStory : isSavingEvent}
						class="flex-1 md:flex-initial"
					>
						{#if isStoryMode ? isSavingStory : isSavingEvent}
							<span class="loading loading-sm loading-spinner"></span>
						{:else}
							<Save class="size-4" />
						{/if}
						<span>{isCreatingNew ? 'Create' : 'Save'}</span>
					</Button>
				{/if}
			</div>
		</div>

		<!-- Form Content -->
		<div class="flex-1 overflow-y-auto p-4 md:p-6">
			{#if isStoryMode}
				<!-- Story Form -->
				<StoryForm
					bind:this={storyFormRef}
					bind:name={storyName}
					bind:description={storyDescription}
					bind:styleText={storyStyleText}
					bind:worldFactsText={storyWorldFactsText}
					bind:coverFile={storyCoverFile}
					bind:coverPreview={storyCoverPreview}
					bind:isDirty={isStoryDirty}
				/>
			{:else if isEventMode}
				<!-- Event Form (Create or Edit) -->
				<EventForm
					bind:this={eventFormRef}
					bind:name={eventName}
					bind:description={eventDescription}
					bind:characters={eventCharacters}
					bind:isDirty={isEventDirty}
				/>
				{#if isCreatingNew}
					<div class="mt-4 rounded-lg border border-info bg-info/10 p-3 md:p-4">
						<p class="text-xs text-info md:text-sm">
							Creating new event
							{#if prevEventForNew}
								after <strong>{prevEventForNew.name || 'Unnamed Event'}</strong>
							{:else}
								at the beginning
							{/if}
						</p>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
