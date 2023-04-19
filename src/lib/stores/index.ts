import { setOrderbookAddress } from '$lib/stores/orderbook'
import { setSubgraphClient } from '$lib/stores/subgraph'
import type { OrderbookComponentsConfig } from '$lib/types/config'

export * from './orderbook'
export * from './subgraph'

export const initOrderbook = async ({ address, subgraphEndpoint }: OrderbookComponentsConfig) => {
    setOrderbookAddress(address)
    setSubgraphClient(subgraphEndpoint)
}