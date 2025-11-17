<script lang="ts">
	import { Upload, X, RotateCcw } from 'lucide-svelte';
	import type { CharactersResponse } from '$lib';
	import { charactersApi, type UpdateCharacterData } from '../charactersApi';
	import pchelImage from '$lib/shared/assets/images/pchel.png';
	import { Button } from '$lib/shared/ui';
	import { charactersStore } from '../characters.svelte';

	interface Props {
		character: CharactersResponse | null;
		title?: string;
		description?: string;
	}

	let {
		character,
		title = 'Character Form',
		description = 'Update character details while chatting'
	}: Props = $props();

	let currentCharacter = $state<CharactersResponse | null>(character);
	let originalSnapshot = $state<CharactersResponse | null>(character);

	let formName = $state('');
	let formDescription = $state('');
	let formAge = $state<number | undefined>(undefined);
	let formAvatarFile: File | null = $state(null);
	let formAvatarPreview: string | null = $state(null);
	let isSaving = $state(false);

	function syncFromCharacter(source: CharactersResponse | null) {
		if (!source) {
			formName = '';
			formDescription = '';
			formAge = undefined;
			formAvatarFile = null;
			formAvatarPreview = null;
			return;
		}

		formName = source.name ?? '';
		formDescription = source.description ?? '';
		formAge = source.age;
		formAvatarFile = null;
		formAvatarPreview = getAvatarUrl(source);
	}

	$effect(() => {
		if (!character) {
			currentCharacter = null;
			originalSnapshot = null;
			syncFromCharacter(null);
			return;
		}

		const nextSnapshotKey = `${character.id}-${character.updated}`;
		const currentSnapshotKey = currentCharacter
			? `${currentCharacter.id}-${currentCharacter.updated}`
			: null;

		if (nextSnapshotKey !== currentSnapshotKey) {
			currentCharacter = character;
			originalSnapshot = character;
			syncFromCharacter(character);
		}
	});

	const hasChanges = $derived.by(() => {
		if (!currentCharacter || !originalSnapshot) return false;
		if (formName.trim() !== (originalSnapshot.name ?? '')) return true;
		if (formDescription.trim() !== (originalSnapshot.description ?? '')) return true;
		if ((formAge ?? undefined) !== (originalSnapshot.age ?? undefined)) return true;
		if (formAvatarFile) return true;
		if (!formAvatarPreview && originalSnapshot.avatar) return true;
		return false;
	});

	function getAvatarUrl(char: CharactersResponse | null): string | null {
		if (!char?.avatar) return null;
		return charactersStore.getCharacterAvatar(char);
	}

	function getDisplayAvatar(): string {
		if (formAvatarPreview) return formAvatarPreview;
		if (currentCharacter) return charactersStore.getCharacterAvatar(currentCharacter);
		return pchelImage;
	}

	function handleAvatarChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			formAvatarFile = file;
			const reader = new FileReader();
			reader.onload = (event) => {
				formAvatarPreview = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function removeAvatar() {
		formAvatarFile = null;
		formAvatarPreview = null;
	}

	function handleReset() {
		syncFromCharacter(originalSnapshot);
	}

	async function handleSave() {
		if (!currentCharacter || !originalSnapshot || !hasChanges || isSaving) return;

		isSaving = true;
		try {
			const data: UpdateCharacterData = {};

			if (formName.trim() !== (originalSnapshot.name ?? '')) data.name = formName.trim();
			if (formDescription.trim() !== (originalSnapshot.description ?? '')) {
				data.description = formDescription.trim();
			}
			if ((formAge ?? undefined) !== (originalSnapshot.age ?? undefined)) data.age = formAge;
			if (formAvatarFile) data.avatar = formAvatarFile;

			const updatedCharacter = await charactersApi.update(currentCharacter.id, data);
			currentCharacter = updatedCharacter;
			originalSnapshot = updatedCharacter;
			syncFromCharacter(updatedCharacter);
		} catch (error) {
			console.error('Failed to save character changes:', error);
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<div class="mb-6 shrink-0">
		<h2 class="text-2xl font-bold text-base-content">{title}</h2>
		<p class="mt-1 text-sm text-base-content/70">{description}</p>
	</div>

	{#if !currentCharacter}
		<div
			class="flex flex-1 items-center justify-center rounded-xl border border-base-300 bg-base-200/80 p-6 text-center text-base-content/60"
		>
			<p>Select a character to start editing.</p>
		</div>
	{:else}
		<div class="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
			<div class="card bg-base-200/80">
				<div class="card-body">
					<div class="label pb-2">
						<span class="label-text font-semibold">Avatar</span>
					</div>
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div class="group avatar relative">
							<div class="w-32 rounded-2xl ring-4 ring-primary ring-offset-2 ring-offset-base-100">
								<img src={getDisplayAvatar()} alt="Avatar preview" />
							</div>
							{#if formAvatarPreview}
								<button
									onclick={removeAvatar}
									class="btn absolute -top-2 -right-2 btn-circle opacity-0 transition-opacity btn-sm btn-error group-hover:opacity-100"
									title="Remove avatar"
								>
									<X class="size-4" />
								</button>
							{/if}
						</div>

						<div class="flex-1">
							<label
								for="chat-character-avatar-input"
								class="btn flex w-full cursor-pointer items-center gap-2 btn-outline btn-primary"
							>
								<Upload class="size-4" />
								<span>{formAvatarFile ? 'Change Avatar' : 'Upload Avatar'}</span>
							</label>
							<input
								id="chat-character-avatar-input"
								type="file"
								accept="image/*"
								onchange={handleAvatarChange}
								class="hidden"
							/>
							<p class="mt-2 text-xs text-base-content/50">
								Recommended: Square image, at least 256×256 px.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div class="card bg-base-200/80">
				<div class="card-body space-y-4">
					<div class="form-control">
						<label class="label pb-2" for="chat-character-name-input">
							<span class="label-text font-semibold">Name</span>
							<span class="label-text-alt text-error">*</span>
						</label>
						<input
							id="chat-character-name-input"
							type="text"
							bind:value={formName}
							placeholder="Character name"
							class="input-bordered input w-full input-primary"
						/>
					</div>

					<div class="form-control">
						<label class="label pb-2" for="chat-character-age-input">
							<span class="label-text font-semibold">Age</span>
						</label>
						<input
							id="chat-character-age-input"
							type="number"
							min="0"
							bind:value={formAge}
							placeholder="Character age"
							class="input-bordered input w-full input-primary"
						/>
					</div>

					<div class="form-control">
						<label class="label pb-2" for="chat-character-description-input">
							<span class="label-text font-semibold">Description</span>
						</label>
						<textarea
							id="chat-character-description-input"
							bind:value={formDescription}
							placeholder="Describe appearance, habits, background..."
							class="textarea-bordered textarea h-32 resize-none textarea-primary"
						></textarea>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 flex shrink-0 justify-end gap-3 border-t border-base-300 pt-4">
			<Button
				onclick={handleReset}
				style="ghost"
				color="neutral"
				class="gap-2"
				disabled={!hasChanges || isSaving}
			>
				<RotateCcw class="size-4" />
				Reset
			</Button>
			<Button onclick={handleSave} color="primary" disabled={!hasChanges || isSaving} class="gap-2">
				{#if isSaving}
					<span class="loading loading-sm loading-spinner"></span>
					Saving
				{:else}
					Save Changes
				{/if}
			</Button>
		</div>
	{/if}
</div>
