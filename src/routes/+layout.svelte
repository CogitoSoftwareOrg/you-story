<script lang="ts">
	import '../app.css';
	import '$lib/apps/user/client/pb-hook';
	import favicon from '$lib/shared/assets/favicon_io/favicon.ico';
	import { PortalHost, ThemeLoad } from '$lib/shared/ui';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<PortalHost />
<ThemeLoad />
{@render children()}
