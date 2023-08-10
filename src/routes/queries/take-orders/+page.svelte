<script lang="ts">
	import { queries, orderbook } from '$lib';
	import { account } from 'svelte-wagmi-stores';
	const { result, refresh, owners, orders } = queries.queryTakeOrderEntities();

	let owner: string, order: string;
	$: $owners = owner ? [owner] : null;
	$: $orders = order ? [order] : null;
</script>

{#if $result?.data}
	{#each $result.data as takeOrder}
		<p>
			{takeOrder.order.id}
			{takeOrder.order.owner.id}
			{takeOrder.inputDisplay}
			{takeOrder.outputToken.symbol}
			{takeOrder.outputDisplay}
			{takeOrder.inputToken.symbol}
		</p>
	{/each}
{:else if $result?.error}
	{JSON.stringify($result.error)}
{:else}
	loading....
{/if}

<button on:click={refresh}>Refresh</button>
<label>owner</label>
<input type="text" bind:value={owner} />
{#if $account && $account.address}
	<button
		on:click={() => {
			$account && $account.address ? (owner = $account.address.toLowerCase()) : null;
		}}>Only mine</button
	>
{/if}
<label>order</label>
<input type="text" bind:value={order} />
