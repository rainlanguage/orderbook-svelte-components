<script lang="ts">
	import { queries } from '$lib';
	const { result, refresh, owners } = queries.queryTakeOrderHistory();

	let owner: string;
	$: $owners = owner !== '' ? [owner] : null;
</script>

{#if $result?.data}
	{#each $result.data as takeOrder}
		{takeOrder.inputToken.symbol}
		{takeOrder.inputDisplay}
		{takeOrder.outputToken.symbol}
		{takeOrder.outputToken.symbol}
	{/each}
{/if}

<button on:click={refresh}>Refresh</button>
<input type="text" bind:value={owner} />
