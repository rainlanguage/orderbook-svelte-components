<script lang="ts">
	import { queries, orderbook } from '$lib';
	import { signerAddress } from 'svelte-ethers-store';
	const { result, refresh, owners } = queries.queryTakeOrderEntities();

	let owner: string;
	$: $owners = owner ? [owner] : null;
	$: console.log($owners);
	$: console.log($orderbook);
	$: console.log($result);
</script>

{#if $result?.data}
	{#each $result.data as takeOrder}
		<p>
			{takeOrder.order.owner.id}
			{takeOrder.outputToken.symbol}
			{takeOrder.inputDisplay}
			{takeOrder.inputToken.symbol}
			{takeOrder.outputDisplay}
		</p>
	{/each}
{:else if $result?.error}
	{JSON.stringify($result.error)}
{:else}
	loading....
{/if}

<button on:click={refresh}>Refresh</button>
<input type="text" bind:value={owner} />
{#if $signerAddress}
	<button
		on:click={() => {
			$owners = [$signerAddress.toLowerCase()];
		}}>Only mine</button
	>
{/if}
