<script lang="ts">
	import { initOrderbook } from '$lib';
	import { defaultEvmStores } from 'svelte-ethers-store';

	initOrderbook({
		address: '0x00fb875f4d86c9c73e0176a6d244047a069ce53d',
		subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/rainprotocol/orderbook-mumbai'
	});

	const connectWallet = async () => {
		defaultEvmStores.setProvider();
	};
</script>

<button on:click={connectWallet}>CONNECT</button>

<slot />
