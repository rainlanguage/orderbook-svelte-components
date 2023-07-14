<script lang="ts">
	import { BigNumber } from 'ethers';
	import { queries, orderbook, type OrderConfigStruct } from '$lib';
	import { tokens } from './tokens';
	import { account } from 'svelte-wagmi-stores';

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
					deployer: '0xb20dfedc1b12aa6afa308064998a28531a18c714',
					constants: [
						"50717328057819670919621266506729799030641233149",
						"1",
						"59180358874249724264754244400400157205534792422",
						"0",
						"84600",
						"1000000000000000000000"
					],
					sources: [
						"0x000c00010004050000280000001700000004060000040601000406020004060300040604000406050004060600050006000c000e00470000002b000000170000000c000e000c000300480000000c00060004010000280000000c000a0004000100280000000c000c001a0000002a0000000c0000000c00020004010200280000000c00020004000000280000000c0005000c000400280000000c00050004040000280000000c000800040402002800000029000900170000000c0000000c0007",
						"0x00040600000c0000000404040028000000170000001a0000000c0009001c0002000c000200040100000d0002000c000400470000000c000600040404001b0002000c0008000c000b002a0000002b000000170000000c0004000c000800480000"
					]
				},
				meta: '0x'
		  } as OrderConfigStruct)
		: null;

	const addOrder = () => {
		if (!$orderbook || !orderConfig) return;
		$orderbook.addOrder(orderConfig);
	};

	$: console.log($orderbook)
</script>

{#if $account?.isConnected}
	<span>vault id</span>
	<input bind:value={vaultId} />
	<button on:click={addOrder}>Add Order</button>
	<hr />
	<pre>
        {JSON.stringify(orderConfig, null, 2)}
    </pre>
{/if}
