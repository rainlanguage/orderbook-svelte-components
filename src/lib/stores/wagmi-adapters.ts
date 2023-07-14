import type { WalletClient } from '@wagmi/core'
import { providers, type Signer} from 'ethers'
import { walletClient } from 'svelte-wagmi-stores'
import { derived, type Readable } from 'svelte/store'

export async function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport, getChainId } = walletClient

  const network = {
    chainId: await getChainId(),
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/**
 * Derived store that returns an ethers.js Signer for the current wagmi walletClient.
 */
export const signer: Readable<Signer | undefined> = derived(walletClient, ($walletClient, set) => {
    if ($walletClient) walletClientToSigner($walletClient).then(r => set(r))
}
)