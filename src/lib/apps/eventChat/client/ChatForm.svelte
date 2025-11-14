<script lang="ts">
	import { charactersStore } from '$lib/apps/character/client';
	import { EventChatsCommitModeOptions } from '$lib';

	interface Props {
		povCharacter?: string;
		commitMode?: EventChatsCommitModeOptions;
		availableCharacters?: string[];
		disabled?: boolean;
	}

	let {
		povCharacter = $bindable(''),
		commitMode = $bindable<EventChatsCommitModeOptions>(EventChatsCommitModeOptions.autoCommit),
		availableCharacters = [],
		disabled = false
	}: Props = $props();

	const commitModeOptions: {
		value: EventChatsCommitModeOptions;
		label: string;
		description: string;
	}[] = [
		{
			value: EventChatsCommitModeOptions.autoCommit,
			label: 'Auto Commit',
			description: 'Automatically commit changes to the story'
		},
		{
			value: EventChatsCommitModeOptions.proposeDiffs,
			label: 'Propose Diffs',
			description: 'Suggest changes for manual review'
		},
		{
			value: EventChatsCommitModeOptions.noncanonical,
			label: 'Non-canonical',
			description: "Explore without affecting the story's canon"
		}
	];

	const eventCharacters = $derived(
		charactersStore.characters.filter((c) => availableCharacters.includes(c.id))
	);

	const povCharacterId = 'pov-character-select';
	const commitModeId = 'commit-mode-select';
</script>

<div class="space-y-4">
	<!-- POV Character - Required -->
	<div class="form-control">
		<label class="label" for={povCharacterId}>
			<span class="label-text font-semibold">POV Character</span>
			<span class="label-text-alt text-xs text-error">Required</span>
		</label>
		<select
			bind:value={povCharacter}
			id={povCharacterId}
			class="select-bordered select w-full"
			required
			{disabled}
		>
			<option value="" disabled>Select a character</option>
			{#each eventCharacters as character}
				<option value={character.id}>{character.name || 'Unnamed Character'}</option>
			{/each}
		</select>
		<div class="label">
			<span class="label-text-alt text-xs text-base-content/60">
				The character whose perspective this chat will follow
			</span>
		</div>
	</div>

	<!-- Commit Mode - Required -->
	<div class="form-control">
		<!-- <label class="label" for={commitModeId}>
			<span class="label-text font-semibold">Commit Mode</span>
			<span class="label-text-alt text-xs text-error">Required</span>
		</label>
		<select
			bind:value={commitMode}
			id={commitModeId}
			class="select-bordered select w-full"
			required
			{disabled}
		>
			{#each commitModeOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select> -->

		<!-- Show description for selected mode -->
		{#if commitMode}
			{@const selectedOption = commitModeOptions.find((o) => o.value === commitMode)}
			{#if selectedOption}
				<div class="label">
					<span class="label-text-alt text-xs text-base-content/60">
						{selectedOption.description}
					</span>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Info Box -->
	<div class="rounded-lg border border-info bg-info/10 p-4">
		<p class="text-sm text-info">
			Once you start the chat, you'll be able to interact with the AI to explore this event from
			your chosen character's perspective.
		</p>
	</div>
</div>
