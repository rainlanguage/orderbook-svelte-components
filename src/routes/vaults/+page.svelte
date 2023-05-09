<script lang="ts">
	import { BigNumber } from 'ethers';
	import { queries, orderbook } from '$lib';
	import { signerAddress } from 'svelte-ethers-store';
	import type { TokenVaultFragmentFragment } from '$lib/gql/generated/graphql';
	const { result, refresh, owners } = queries.queryTokenVaults();

	$: $owners = $signerAddress ? [$signerAddress] : null;

	const removeFromVault = async (vault: TokenVaultFragmentFragment) => {
		if (!$orderbook) return;
		await $orderbook.withdraw({
			vaultId: vault.vaultId,
			token: vault.token.id,
			amount: vault.balance
		});
	};
</script>

{#if $result?.data}
	{#each $result.data as vault}
		<p>
			{BigNumber.from(vault.vaultId).toHexString()}
			{vault.token.symbol}
			{vault.token.id}
			{vault.balanceDisplay}
			{vault.owner.id}
			{#if $signerAddress}
				<button
					on:click={() => {
						removeFromVault(vault);
					}}>Withdraw all</button
				>
			{/if}
		</p>
	{/each}
{:else if $result?.error}
	{JSON.stringify($result.error)}
{:else}
	loading....
{/if}
