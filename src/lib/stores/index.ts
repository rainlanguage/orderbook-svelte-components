import { setOrderbookAddress } from '$lib/stores/orderbook'
import { setSubgraphClient } from '$lib/stores/subgraph'
import type { OrderbookComponentsConfig } from '$lib/types/config'

export * from './orderbook'
export * from './subgraph'

/**
 * Initialize this package.
 * After this the Orderbook contract instance will be available in the $orderbook store.
 * The subgraph client will be available in the $subgraphClient store.
 * @param config - Configuration object
 */
export const initOrderbook = async ({ address, subgraphEndpoint }: OrderbookComponentsConfig) => {
    setOrderbookAddress(address)
    setSubgraphClient(subgraphEndpoint)
}