<script lang="ts">
	import { userStore } from '$lib/apps/user/client';

	const user = $state(userStore.user);
</script>

<div>
	<h1>App</h1>
	{#if user}
		<p>Welcome, {user.name}</p>
	{/if}
</div>
