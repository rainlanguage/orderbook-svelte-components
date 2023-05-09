import { ethers } from 'ethers'

/**
 * Generate a vaultId.
 * This can be used as a unique identifier for a vault, and is a random 32 byte hex string.
 */
export const generateVaultId = () => {
    return ethers.utils.hexlify(ethers.utils.randomBytes(32))
}