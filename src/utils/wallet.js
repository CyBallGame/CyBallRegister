// Set of helper functions to facilitate wallet setup
import { CHAIN_CONFIG } from 'config/constant'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum

  if (provider) {
    const chainId = parseInt(CHAIN_CONFIG.SUPPORTED_CHAINID, 10)
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: `${CHAIN_CONFIG.NETWORK}`,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: [`${CHAIN_CONFIG.SUPPORTED_RPC}`],
            blockExplorerUrls: [`${CHAIN_CONFIG.BLOCK_EXPLORER_URLS}`],
          },
        ],
      })
      return true
    } catch (error) {
      //   toast.error('Failed to setup the network in Metamask:', {
      //     hideProgressBar: true,
      //   })
      return false
    }
  } else {
    // toast.error("Can't setup the BSC network on metamask because window.ethereum is undefined", {
    //   hideProgressBar: true,
    // })
    return false
  }
}
