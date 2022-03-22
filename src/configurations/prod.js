import baseConfigs from './base'

const configs = {
  NETWORK: 'bsc',
  SUPPORTED_CHAINID: 56,
  SUPPORTED_RPC: 'https://solitary-snowy-river.bsc.quiknode.pro/16b4e8d1466a4e5c06c88145a2faed83b3661fd9/',
  BLOCK_EXPLORER_URLS: 'https://bscscan.com/',
  CBT_TOKEN_ADDRESS: '0x7c73967dC8c804Ea028247f5A953052f0CD5Fd58',
  API_CYBALL: 'https://app-api.cyball.com/api',
}

export default Object.freeze({
  ...baseConfigs,
  ...configs,
})
