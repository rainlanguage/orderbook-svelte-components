import { derived, writable } from "svelte/store";
import { signer } from 'svelte-ethers-store'
import type { OrderBook } from "$lib/types";
import { ethers } from "ethers";
import OrderBookArtifact from '$lib/abi/Orderbook.json'

export const orderbookAddress = writable<string | null>(null);

/**
 * Set the address of the orderbook contract.
 * Once set it will be available in the $orderbook store.
 * @param address - Address of the orderbook contract
 */
export const setOrderbookAddress = (address: string) => orderbookAddress.set(address)

export const orderbook = derived([signer, orderbookAddress], ([$signer, $orderbookAddress]) => {
    if ($signer && $orderbookAddress) {
        return new ethers.Contract(
            $orderbookAddress,
            OrderBookArtifact.abi,
            $signer
        ) as OrderBook;
    } else {
        return null;
    }
})

