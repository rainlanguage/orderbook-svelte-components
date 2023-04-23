<script lang="ts">
	import { queries, orderbook } from '$lib';
	const { result, refresh, owners } = queries.queryTakeOrderHistory();

	let owner: string;
	$: $owners = owner !== '' ? [owner] : null;

	$: console.log($orderbook);
</script>

{#if $result?.data}
	{#each $result.data as takeOrder}
		{takeOrder.inputToken.symbol}
		{takeOrder.inputDisplay}
		{takeOrder.outputToken.symbol}
		{takeOrder.outputToken.symbol}
	{/each}
{:else if $result?.error}
	{JSON.stringify($result.error)}
{:else}
	loading....
{/if}

<button on:click={refresh}>Refresh</button>
<input type="text" bind:value={owner} />
{$orderbook?.address}
