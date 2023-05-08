<script lang="ts">
	import { BigNumber } from 'ethers';
	import { queries, orderbook, type OrderConfigStruct } from '$lib';
	import { tokens } from './tokens';
	import { signerAddress } from 'svelte-ethers-store';

	let vaultId: string = '';

	$: orderConfig = vaultId
		? ({
				validInputs: tokens.map((token) => ({
					vaultId: BigNumber.from(vaultId),
					decimals: token.decimals,
					token: token.address
				})),
				validOutputs: tokens.map((token) => ({
					vaultId: BigNumber.from(vaultId),
					decimals: token.decimals,
					token: token.address
				})),
				evaluableConfig: {
					deployer: '0x3d7d894afc7DbFD45bf50867C9B051da8EEE85e9',
					constants: [
						'115792089237316195423570985008687907853269984665640564039457584007913129639935',
						'1000100000000000000'
					],
					sources: ['0x000c0001000c0003', '0x']
				},
				meta: '0x'
		  } as OrderConfigStruct)
		: null;

	const addOrder = () => {
		if (!$orderbook || !orderConfig) return;
		$orderbook.addOrder(orderConfig);
	};
</script>

{#if $signerAddress}
	<span>vault id</span>
	<input bind:value={vaultId} />
	<button on:click={addOrder}>Add Order</button>
	<hr />
	<pre>
        {JSON.stringify(orderConfig, null, 2)}
    </pre>
{/if}
