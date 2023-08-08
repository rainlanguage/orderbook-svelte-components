import { setOrderbookAddress } from '$lib/stores/orderbook'
import { setSubgraphClient } from '$lib/stores/subgraph'
import type { OrderbookComponentsConfig } from '$lib/types/config'
import { getAddress, isAddress } from 'viem'

export * from './orderbook'
export * from './subgraph'

/**
 * Initialize this package.
 * After this the Orderbook contract instance will be available in the $orderbook store.
 * The subgraph client will be available in the $subgraphClient store.
 * @param config - Configuration object
 */
export const initOrderbook = async ({ address, subgraphEndpoint }: OrderbookComponentsConfig) => {
    if (!isAddress(address)) {
        console.warn(`Invalid address ${address}`)
        return
    }
    const _address = getAddress(address)
    if (!await checkOrderbookAddress(address, subgraphEndpoint)) return
    setOrderbookAddress(_address)
    setSubgraphClient(subgraphEndpoint)
}

/**
 * Check that the Orderbook address being used is actually being indexed by the subgraph endpoint.
 */
export const checkOrderbookAddress = async (orderbookAddress: string, subgraphEndpoint: string) => {
    const query = `
        query {
            orderBooks(where: {address: "${orderbookAddress}"}) {
                id
            }
        }
    `
    const response = await fetch(subgraphEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    })
    const json = await response.json()

    if (!json.data?.orderBooks?.length) {
        console.warn(`No orderbook found at address ${orderbookAddress} on subgraph ${subgraphEndpoint}`)
        return false
    }
    return true
}