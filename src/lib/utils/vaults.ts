import { getRandomValues } from 'crypto'

/**
 * Generate a vaultId.
 * This can be used as a unique identifier for a vault, and is a random 32 byte hex string.
 */
export const generateVaultId = (): Uint8Array => {
    return getRandomValues(new Uint8Array(32))
}