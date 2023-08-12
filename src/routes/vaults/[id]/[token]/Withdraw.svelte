<script lang="ts">
	import type { TokenVaultsQuery } from '$lib/gql/generated/graphql';
	import { orderbook, orderbookAddress } from '$lib';
	import { Button, FloatingLabelInput, Heading } from 'flowbite-svelte';
	import { walletClient, account, network } from 'svelte-wagmi-stores';

	export let vault: TokenVaultsQuery['tokenVaults'][0];

	let amount: number;
	$: withdrawAmount = amount
		? BigInt(amount) * BigInt(10) ** BigInt(vault.token.decimals)
		: BigInt(0);

	$: ({ status, write, error, data } = $orderbook.write({
		functionName: 'withdraw',
		args: [
			{
				vaultId: vault.vaultId,
				token: vault.token.id as `0x${string}`,
				amount: withdrawAmount
			}
		],
		onSuccess: ({ receipt }) => {
			console.log(receipt);
		}
	}));

	$: console.log($status);
</script>

<div class="gap-y-4 flex flex-col p-4 border border-gray-300 rounded-lg items-start">
	<Heading tag="h5">Withdraw</Heading>
	<FloatingLabelInput label="Amount" style="outlined" type="number" bind:value={amount} />
	<Button
		disabled={$status == 'loading' || withdrawAmount == BigInt(0) || vault.balance < withdrawAmount}
		class="whitespace-nowrap"
		on:click={write}>Withdraw</Button
	>

	{#if $status == 'loading'}
		<p>Confirming...</p>
	{:else if $status == 'success'}
		<p>Confirmed</p>
		<p>Transaction hash: {$data?.hash}</p>
	{:else if $status == 'error'}
		<p>{$error}</p>
	{/if}
</div>
