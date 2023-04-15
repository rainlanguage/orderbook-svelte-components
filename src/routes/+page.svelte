<script>
	import { queries } from '$lib';
	import { Client, cacheExchange, fetchExchange } from '@urql/svelte';

	const client = new Client({
		url: 'https://api.thegraph.com/subgraphs/name/rainprotocol/orderbook-mumbai',
		exchanges: [cacheExchange, fetchExchange]
	});

	const query = client.query(queries.takeOrderHistoryQuery, {}).toPromise();
</script>

{#await query}
	<p>loading...</p>
{:then { data }}
	{#if data?.takeOrderEntities.length}
		{#each data?.takeOrderEntities as order}
			<div>
				{order.inputToken.name}
			</div>
		{/each}
	{/if}
{/await}
