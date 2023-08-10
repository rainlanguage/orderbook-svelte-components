<script lang="ts">
	import { queries, orderbook } from '$lib';
	import { account } from 'svelte-wagmi-stores';
	import type { TokenVaultFragmentFragment } from '$lib/gql/generated/graphql';
	const { result, refresh, owners } = queries.queryTokenVaults();
	import { numberToHex, getAddress } from 'viem'

	let owner: string;
	$: $owners = owner ? [owner] : null;

	const removeFromVault = async (vault: TokenVaultFragmentFragment) => {
		if (!$orderbook) return;
		await $orderbook.write.withdraw([
			{
				vaultId: vault.vaultId,
				token: vault.token.id as `0x${string}`,
				amount: vault.balance
			}
		]);
	};
</script>

{#if $result?.data}
	{#each $result.data as vault}
		<p>
			{numberToHex(BigInt(vault.vaultId))}
			{vault.token.symbol}
			{vault.token.id}
			{vault.balanceDisplay}
			{vault.owner.id}
			{#if $account?.address && (getAddress($account?.address) == getAddress(vault.owner.id))}
				<button
					on:click={() => {
						removeFromVault(vault);
					}}>Withdraw all</button
				>
			{/if}
		</p>
	{/each}
	<p>
		<button on:click={refresh}>Refresh</button>
		<input type="text" bind:value={owner} />
		{#if $account?.address}
			<button
				on:click={() => {
					$owners = [$account?.address?.toLowerCase() || ''];
				}}>Only mine</button
			>
		{/if}
	</p>
{:else if $result?.error}
	{JSON.stringify($result.error)}
{:else}
	loading....
{/if}
