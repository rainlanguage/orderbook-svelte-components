<script lang="ts">
	import { queries, orderbook, type OrderStruct } from '$lib';
	import { signerAddress } from 'svelte-ethers-store';
	const { result, refresh, owners } = queries.queryOrders();

	let owner: string;
	$: $owners = owner ? [owner] : null;

	const removeOrder = async (order: OrderStruct) => {
		if (!$orderbook) return;
		await $orderbook.removeOrder(order);
	};
</script>

{#if $result?.data}
	{#each $result.data as order}
		<p>
			{order.owner.id}
			{#if order.validInputs}
				{#each order.validInputs as input}
					<p>
						{input.tokenVault.token.symbol}
						{input.tokenVault.balanceDisplay}
					</p>
				{/each}
			{/if}
			{order.orderActive ? 'Order Active' : 'Order Inactive'}
		</p>
		{#if $orderbook && $signerAddress.toLowerCase() == order.owner.id.toLowerCase() && order.orderActive}
			<button
				on:click={() => {
					const orderstruct = JSON.parse(order.orderJSONString);
					removeOrder(orderstruct);
				}}>Remove</button
			>
		{/if}
		<hr />
	{/each}
{:else if $result?.error}
	{JSON.stringify($result.error)}
{:else}
	loading....
{/if}
<p>
	<button on:click={refresh}>Refresh</button>
	<input type="text" bind:value={owner} />
	{#if $signerAddress}
		<button
			on:click={() => {
				$owners = [$signerAddress.toLowerCase()];
			}}>Only mine</button
		>
	{/if}
</p>
