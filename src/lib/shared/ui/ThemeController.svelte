<script module>
	const LIGHT_THEME = 'LIGHT';
	const DARK_THEME = 'DARK';

	let selectedDark = $state(false);
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Sun, Moon } from 'lucide-svelte';

	const { expanded = false } = $props();

	const themeLabel = $derived(selectedDark ? 'Dark mode' : 'Light mode');

	onMount(() => {
		const theme = localStorage.getItem('theme');
		theme === DARK_THEME ? (selectedDark = true) : (selectedDark = false);
	});

	$effect(() => {
		let newTheme = LIGHT_THEME;
		if (selectedDark) newTheme = DARK_THEME;

		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
	});
</script>

{#if expanded}
	<label
		class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-base-300 px-2 py-1 transition-colors hover:bg-base-300"
	>
		<input
			bind:checked={selectedDark}
			type="checkbox"
			class="theme-controller hidden"
			value={selectedDark ? DARK_THEME : LIGHT_THEME}
		/>

		{#if selectedDark}
			<Moon class="swap-on size-7" />
		{:else}
			<Sun class="swap-off size-7" />
		{/if}

		<span class="text-sm font-medium text-nowrap text-base-content">{themeLabel}</span>
	</label>
{:else}
	<label class="swap swap-rotate cursor-pointer">
		<input
			bind:checked={selectedDark}
			type="checkbox"
			class="theme-controller hidden"
			value={selectedDark ? DARK_THEME : LIGHT_THEME}
		/>

		<Sun class="swap-off size-9" />
		<Moon class="swap-on size-9" />
	</label>
{/if}
