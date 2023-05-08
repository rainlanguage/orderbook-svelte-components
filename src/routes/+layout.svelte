<script lang="ts">
	import { initOrderbook } from '$lib';
	import { defaultEvmStores } from 'svelte-ethers-store';

	initOrderbook({
		address: '0xd14c2Ba8779C6c4Fba0D0606f4Ff65ecd4C5Bb38',
		subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/siddharth2207/slsohysubgraph'
	});

	const connectWallet = async () => {
		defaultEvmStores.setProvider();
	};
</script>

<button on:click={connectWallet}>CONNECT</button>

<slot />
