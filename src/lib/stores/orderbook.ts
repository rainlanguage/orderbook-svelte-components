import { derived, writable, type Writable } from "svelte/store";
import { IOrderBookV2 } from '$lib/abi/IOrderBookV2'
import { walletClient } from 'svelte-wagmi-stores'
import type { PrepareWriteContractConfig, WalletClient, WriteContractPreparedArgs, WriteContractUnpreparedArgs, WriteContractResult, PrepareWriteContractResult } from '@wagmi/core'
import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'
import type { Hex, TransactionReceipt } from 'viem'

export const orderbookAddress = writable<`0x${string}` | null>(null);

/**
 * Set the address of the orderbook contract.
 * Once set it will be available in the $orderbook store.
 * @param address - Address of the orderbook contract
 */
export const setOrderbookAddress = (address: `0x${string}`) => orderbookAddress.set(address)

export const orderbook = derived([orderbookAddress, walletClient], ([$orderbookAddress, $walletClient]) => {
    if ($orderbookAddress && $walletClient) {
        return new Orderbook($orderbookAddress, $walletClient)
    } else {
        return new Orderbook();
    }
})

type ObWriteHooks = {
    onError?: (error: Error) => void
    onSettled?: (result: WriteContractResult) => void
    onSuccess?: (args: { hash: Hex, receipt: TransactionReceipt }) => any
}

type ObWriteReturn = {
    data: Writable<{ hash: Hex } | undefined>
    error: Writable<Error | undefined>
    isError: Writable<boolean>
    isIdle: Writable<boolean>
    isLoading: Writable<boolean>
    isSuccess: Writable<boolean>
    write: (() => void) | undefined
    writeAsync: (() => Promise<{ hash: Hex }>) | undefined
    // reset: () => void
    status: Writable<'idle' | 'error' | 'loading' | 'success'>
}

// type ObWriteResultStore = Writable<ObWriteResult>
class Orderbook {
    constructor(address?: `0x${string}`, walletClient?: WalletClient) {
        this.address = address
        this.walletClient = walletClient
    }

    private address: `0x${string}` | undefined
    private walletClient: WalletClient | undefined

    async prepareWrite<
        TAbi extends typeof IOrderBookV2,
        TFunctionName extends string,
        TChainId extends number,
        TWalletClient extends WalletClient = WalletClient
    >({
        args,
        chainId,
        functionName,
        ...config
    }: Omit<PrepareWriteContractConfig<
        TAbi,
        TFunctionName,
        TChainId,
        TWalletClient
    >, 'abi' | 'address' | 'walletClient'>): Promise<PrepareWriteContractResult<TAbi, TFunctionName, TChainId>> {

        return await prepareWriteContract({
            address: this.address,
            walletClient: this.walletClient,
            abi: IOrderBookV2,
            functionName,
            args,
            chainId
        } as PrepareWriteContractConfig<TAbi, TFunctionName, TChainId, TWalletClient>)
    }

    write<
        TAbi extends typeof IOrderBookV2,
        TFunctionName extends string,
    >(
        config:
            ObWriteHooks &
            (Omit<WriteContractUnpreparedArgs<TAbi, TFunctionName>, 'address' | 'abi'>
                | WriteContractPreparedArgs<TAbi, TFunctionName>),
    ): ObWriteReturn {

        const result: ObWriteReturn = {
            status: writable('idle'),
            data: writable(undefined),
            error: writable(undefined),
            isError: writable(false),
            isIdle: writable(true),
            isLoading: writable(false),
            isSuccess: writable(false),
            write: undefined,
            writeAsync: undefined,
        }
        // if we don't have an address or wallet client
        if (!this.address || !this.walletClient) {
            console.log('unprepared result')
            return result
        }

        // const result = writable<ObWriteResult>({ status: ObWriteStatus.pending })

        let _config: WriteContractUnpreparedArgs<TAbi, TFunctionName>
            | WriteContractPreparedArgs<TAbi, TFunctionName>

        if (config.mode !== 'prepared') {
            _config = { ...config, address: this.address, abi: IOrderBookV2 } as WriteContractUnpreparedArgs<TAbi, TFunctionName>
        } else {
            _config = config as WriteContractPreparedArgs<TAbi, TFunctionName>
        }

        result.write = () => {
            console.log('write')
            result.status.set('loading')
            result.isIdle.set(false)
            result.isLoading.set(true)
            writeContract(_config).then(({ hash }) => {
                result.data.set({ hash })
                waitForTransaction({ hash }).then(receipt => {
                    result.status.set('success')
                    result.isSuccess.set(true)
                    result.isLoading.set(false)
                    if (config?.onSuccess) {
                        config.onSuccess({ hash, receipt })
                    }
                })
            }).catch(error => {
                result.status.set('error')
                result.error = error
                result.isError.set(true)
                result.isLoading.set(false)
            })
        }

        result.writeAsync = async () => {
            result.isIdle.set(false)
            result.isLoading.set(true)
            try {
                const { hash } = await writeContract(_config)
                result.data.set({ hash })
                result.isSuccess.set(true)
                result.isLoading.set(false)
                return { hash }
            } catch (error) {
                throw error
            }
        }
        console.log(result)
        return result
    }
}