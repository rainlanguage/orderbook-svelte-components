import { derived, writable } from "svelte/store";
import { signer } from 'svelte-ethers-store'
import type { OrderBook } from "$lib/types";
import { ethers } from "ethers";
import OrderBookArtifact from '$lib/abi/Orderbook.json'

const orderbookAddress = writable<string | null>(null);
export const setOrderbookAddress = (address: string) => { orderbookAddress.set(address) }

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