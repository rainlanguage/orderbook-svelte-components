import { derived, writable } from "svelte/store";
import { signer } from './wagmi-adapters';
import { IOrderBookV2 } from '$lib/abi/IOrderBookV2'
import { getContract } from '@wagmi/core'
import { walletClient } from 'svelte-wagmi-stores'

export const orderbookAddress = writable<`0x${string}` | null>(null);

/**
 * Set the address of the orderbook contract.
 * Once set it will be available in the $orderbook store.
 * @param address - Address of the orderbook contract
 */
export const setOrderbookAddress = (address: `0x${string}`) => orderbookAddress.set(address)

export const orderbook = derived([signer, orderbookAddress, walletClient], ([$signer, $orderbookAddress, $walletClient]) => {
    if ($signer && $orderbookAddress && $walletClient) {
        return getContract({ address: $orderbookAddress, abi: IOrderBookV2, walletClient: $walletClient })
    } else {
        return null;
    }
})