import baseConfigs from './base'

const configs = {
  NETWORK: 'tomochain',
  SUPPORTED_CHAINID: 89,
  SUPPORTED_RPC: 'https://rpc.testnet.tomochain.com/',
  BLOCK_EXPLORER_URLS: 'https://scan.testnet.tomochain.com/',
  CBT_TOKEN_ADDRESS: '0x21c6863c1cf056713a6b7d9f62e4638d91d4123f',
  API_CYBALL: 'https://cyball-api.azurewebsites.net/api',
}

export default Object.freeze({
  ...baseConfigs,
  ...configs,
})
