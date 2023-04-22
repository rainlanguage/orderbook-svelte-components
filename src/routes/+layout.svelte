<script lang="ts">
	import { initOrderbook } from '$lib';

	initOrderbook({
		address: '0x00fb875f4d86c9c73e0176a6d244047a069ce53d',
		subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/rainprotocol/orderbook-mumbai'
	});
</script>

<slot />
