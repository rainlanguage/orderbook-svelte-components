<script lang="ts">
	import { account, network, makeContractStore } from 'svelte-wagmi-stores';
	import type { TokenVaultsQuery } from '$lib/gql/generated/graphql';
	import { orderbook, orderbookAddress } from '$lib';
	import { Alert, Button, FloatingLabelInput, Heading, P, Spinner } from 'flowbite-svelte';
	import { IERC20 } from '$lib/abi/IERC20';
	import { onMount } from 'svelte';
	import Property from '$lib/components/Property.svelte';

	export let vault: TokenVaultsQuery['tokenVaults'][0];

	$: erc20 = makeContractStore(IERC20, vault.token.id as `0x${string}`);

	onMount(() => {
		erc20 = makeContractStore(IERC20, vault.token.id as `0x${string}`);
	});

	let amount: number;
	$: depositAmount = amount
		? BigInt(amount) * BigInt(10) ** BigInt(vault.token.decimals)
		: BigInt(0);

	$: ({ write, error, isLoading, isSuccess, isError, data } = $orderbook.write({
		functionName: 'deposit',
		args: [
			{
				vaultId: vault.vaultId,
				token: vault.token.id as `0x${string}`,
				amount: depositAmount
			}
		],
		onSuccess: ({ receipt }) => {
			console.log(receipt);
		}
	}));

	$: ({
		write: writeApprove,
		status: approveStatus,
		data: approveData,
		error: approveError
	} = $erc20.write({
		functionName: 'approve',
		args: [$orderbookAddress, depositAmount],
		onSuccess: () => {
			checkAllowanceAndBalance();
		}
	}));

	let allowance: bigint | undefined;
	let balance: bigint | undefined;

	$: if ($account?.address && $erc20) {
		checkAllowanceAndBalance();
	}

	const checkAllowanceAndBalance = () => {
		if (!$account?.address) return;
		$erc20
			.read({
				functionName: 'allowance',
				args: [$account?.address, $orderbookAddress]
			})
			.then((result) => {
				console.log(result);
				allowance = result;
			})
			.catch((e) => {
				console.error(e);
			});
		$erc20
			.read({ functionName: 'balanceOf', args: [$account?.address] })
			.then((result) => {
				console.log(result);
				balance = result;
			})
			.catch((e) => {
				console.error(e);
			});
	};

	$: allowanceOk = typeof allowance == 'bigint' && allowance >= depositAmount;
	$: balanceOk = balance && balance >= depositAmount;
</script>

<div class="gap-y-4 flex flex-col p-4 border border-gray-300 rounded-lg items-start">
	<Heading tag="h6">Deposit</Heading>
	<Property label="Your balance">
		{balance !== undefined
			? (balance / BigInt(10) ** BigInt(vault.token.decimals)).toString()
			: '...'}
		{vault.token.symbol}
	</Property>
	<FloatingLabelInput label="Amount" style="outlined" type="number" bind:value={amount} />
	{#if !allowanceOk}
		<Button on:click={writeApprove} disabled={$approveStatus == 'loading' || !balanceOk}>
			{#if $approveStatus == 'loading'}
				<Spinner size="5" class="mr-2" />
				<span>Confirming approval...</span>
			{:else}
				<span>Approve allowance</span>
			{/if}
		</Button>
		<P color="text-red-500" size="sm">
			{#if !balanceOk}
				Deposit amount exceeds balance.
			{/if}
		</P>
		{#if $approveStatus == 'success' || $approveStatus == 'error'}
			<Alert
				color={$approveStatus == 'success' ? 'green' : 'red'}
				class="max-w-full whitespace-break-spaces overflow-clip w-full"
			>
				{#if $approveStatus == 'success'}
					<p>Approval confirmed</p>
					<p>
						<a
							target="_blank"
							href={`${$network?.chain?.blockExplorers?.default.url}/tx/${$approveData?.hash}`}
							>Transaction: {$approveData?.hash}</a
						>
					</p>
				{:else if $approveStatus == 'error'}
					<p>{$approveError}</p>
				{/if}
			</Alert>
		{/if}
	{:else}
		<Button
			disabled={$isLoading || depositAmount == BigInt(0) || !allowanceOk || !balanceOk}
			class="whitespace-nowrap"
			on:click={write}
		>
			{#if $isLoading}
				<Spinner size="5" class="mr-2" />
				<span>Confirming...</span>
			{:else}
				<span>Deposit</span>
			{/if}
		</Button>
		{#if $isSuccess || $isError}
			<Alert
				color={$isSuccess ? 'green' : 'red'}
				class="max-w-full whitespace-break-spaces overflow-clip w-full"
			>
				{#if $isSuccess}
					<p>Confirmed</p>
					<p>
						<a
							target="_blank"
							href={`${$network?.chain?.blockExplorers?.default.url}/tx/${$data?.hash}`}
							>Transaction: {$data?.hash}</a
						>
					</p>
				{:else if $isError}
					<p>{$error}</p>
				{/if}
			</Alert>
		{/if}
	{/if}
</div>
