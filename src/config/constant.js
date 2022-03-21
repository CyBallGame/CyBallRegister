const isDev = location.host.indexOf('localhost') === 0

export const API_CYBALL = isDev ? 'https://cyball-api.azurewebsites.net/api' : 'https://app-api.cyball.com/api'
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const PASSWORD_REG = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/

export const CHAIN_CONFIG = isDev
  ? {
    NETWORK: 'tomochain',
    SUPPORTED_CHAINID: 89,
    SUPPORTED_RPC: 'https://rpc.testnet.tomochain.com/',
    BLOCK_EXPLORER_URLS: 'https://scan.testnet.tomochain.com/',
    CBT_TOKEN_ADDRESS: '0x21c6863c1cf056713a6b7d9f62e4638d91d4123f',
  }
  : {
    NETWORK: 'bsc',
    SUPPORTED_CHAINID: 56,
    SUPPORTED_RPC: 'https://solitary-snowy-river.bsc.quiknode.pro/16b4e8d1466a4e5c06c88145a2faed83b3661fd9/',
    BLOCK_EXPLORER_URLS: 'https://bscscan.com/',
    CBT_TOKEN_ADDRESS: '0x7c73967dC8c804Ea028247f5A953052f0CD5Fd58',
  }
