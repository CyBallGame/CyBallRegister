import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'

export const ConnectorNames = {
  Injected: 'injected',
  WalletConnect: 'walletconnect',
  BSC: 'bsc',
}

const POLLING_INTERVAL = 12000

export const connectorLocalStorageKey = 'connectorIdv2'

const walletconnect = new WalletConnectConnector({
  rpc: {
    56: 'https://solitary-snowy-river.bsc.quiknode.pro/16b4e8d1466a4e5c06c88145a2faed83b3661fd9/',
    137: 'https://attentive-lingering-hill.matic.quiknode.pro/41110a3f3f1a4e058ab7b2452a55a7462f5dc56a/',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})
const chainIds = [56, 89, 137]
const bscConnector = new BscConnector({ supportedChainIds: chainIds })
export const injected = new InjectedConnector({ supportedChainIds: chainIds })

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export const getLibrary = (provider) => provider
