<script lang="ts">
	import { queries, orderbook } from '$lib';
	import { account } from 'svelte-wagmi-stores';
	import {
		Button,
		FloatingLabelInput,
		Indicator,
		Input,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';

	const { result, refresh, owners, orders, validInputs, validOutputs } = queries.queryOrders();
	let owner: string, order: string;
	$: $owners = owner ? [owner] : null;
	$: $orders = order ? [order] : null;

	const removeOrder = async (order: any) => {
		if (!$orderbook) return;
		await $orderbook.write.removeOrder(order);
	};
</script>

<div class="flex flex-col gap-y-2 items-start border border-gray-200 p-8 rounded-md mb-6">
	<FloatingLabelInput label="Order" style="outlined" type="text" bind:value={order} />
	<FloatingLabelInput label="Owner" style="outlined" type="text" bind:value={owner} />
	{#if $account?.address}
		<Button
			class="whitespace-nowrap"
			on:click={() => {
				owner = $account?.address?.toLowerCase() || '';
			}}>Show only mine</Button
		>
	{/if}
</div>
<div class="mb-6 w-full flex justify-end">
	<Button size="xs" on:click={refresh}>Refresh</Button>
</div>
<Table divClass="overflow-x-scroll" shadow>
	<TableHead>
		<TableHeadCell>Active</TableHeadCell>
		<TableHeadCell>Orderhash</TableHeadCell>
		<TableHeadCell>Added</TableHeadCell>
		<TableHeadCell>Owner</TableHeadCell>
		<TableHeadCell>Valid inputs</TableHeadCell>
		<TableHeadCell>Valid outputs</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y font-regular">
		{#if $result?.data}
			{#each $result.data as order}
				<TableBodyRow>
					<TableBodyCell><Indicator color={order.orderActive ? 'green' : 'gray'} /></TableBodyCell>
					<TableBodyCell>{order.orderHash}</TableBodyCell>
					<TableBodyCell>{new Date(order.timestamp * 1000).toLocaleDateString()}</TableBodyCell>
					<TableBodyCell>{order.owner.id}</TableBodyCell>
					<TableBodyCell>
						{#if order.validInputs}
							{#each order.validInputs as input}
								<p>
									<!-- {input.vaultId} -->
									{input.tokenVault.token.symbol}
									{input.tokenVault.balanceDisplay}
								</p>
							{/each}
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{#if order.validOutputs}
							{#each order.validOutputs as output}
								<p>
									<!-- {output.vaultId} -->
									{output.tokenVault.token.symbol}
									{output.tokenVault.balanceDisplay}
								</p>
							{/each}
						{/if}
					</TableBodyCell>
				</TableBodyRow>
				<!-- {#if $orderbook && $account?.address?.toLowerCase() == order.owner.id.toLowerCase() && order.orderActive}
						<button
							on:click={() => {
								const orderstruct = JSON.parse(order.orderJSONString);
								removeOrder(orderstruct);
							}}>Remove</button
						>
					{/if} -->
			{/each}
		{:else if $result?.error}
			{JSON.stringify($result.error)}
		{:else}
			<div class="w-full flex justify-center items-center py-4">
				<Spinner />
			</div>
		{/if}
	</TableBody>
</Table>
