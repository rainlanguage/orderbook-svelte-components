<script lang="ts">
	import { queries, orderbook } from '$lib';
	import { account } from 'svelte-wagmi-stores';
	import { toHex } from 'viem';
	import {
		Button,
		FloatingLabelInput,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { TokenVaultsQuery } from '$lib/gql/generated/graphql';
	import { goto } from '$app/navigation';

	const { result, refresh, owners, orders, tokens } = queries.queryTokenVaults();

	let owner: string, order: string, token: string;
	$: $owners = owner ? [owner] : null;
	$: $orders = order ? [order] : null;
	$: $tokens = token ? [token] : null;
</script>

<div class="flex flex-col gap-y-2 items-start border border-gray-200 p-8 rounded-md mb-6">
	<FloatingLabelInput label="Order" style="outlined" type="text" bind:value={order} />
	<FloatingLabelInput label="Owner" style="outlined" type="text" bind:value={owner} />
	<FloatingLabelInput label="Token" style="outlined" type="text" bind:value={token} />
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
<Table divClass="overflow-x-scroll" shadow hoverable>
	<TableHead>
		<TableHeadCell>Owner</TableHeadCell>
		<TableHeadCell>ID</TableHeadCell>
		<TableHeadCell>Token</TableHeadCell>
		<TableHeadCell>Balance</TableHeadCell>
		<TableHeadCell>Linked orders</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y font-regular">
		{#if $result?.data}
			{#each $result.data as vault}
				<TableBodyRow
					on:click={() => {
						goto(`/vaults/${toHex(BigInt(vault.vaultId))}/${vault.token.id}`);
					}}
				>
					<TableBodyCell>{vault.owner.id}</TableBodyCell>
					<TableBodyCell>{toHex(BigInt(vault.vaultId))}</TableBodyCell>
					<TableBodyCell>
						<p>{vault.token.name}</p>
						<p class="text-gray-400">{vault.token.id}</p>
					</TableBodyCell>
					<TableBodyCell>{vault.balanceDisplay}</TableBodyCell>
					<TableBodyCell>
						{#if vault.orders}
							{#each vault.orders as order}
								<p>
									{order.orderHash}
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
