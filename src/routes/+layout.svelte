<script lang="ts">
	import '../app.css';
	import '$lib/apps/user/client/pb-hook';
	import favicon from '$lib/shared/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
