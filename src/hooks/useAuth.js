/* eslint-disable no-else-return */
import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { toast } from 'react-toastify'
import { NoBscProviderError, UserRejectedRequestError } from '@binance-chain/bsc-connector'
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { connectorsByName, connectorLocalStorageKey } from 'utils/web3React'

const useAuth = () => {
  const { activate, deactivate, chainId } = useWeb3React()

  const logout = useCallback(() => {
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close()
      connectorsByName.walletconnect.walletConnectProvider = null
    }
  }, [deactivate, chainId])

  const login = useCallback((connectorID) => {
    const connector = connectorsByName[connectorID]
    if (connector) {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          if (connector instanceof InjectedConnector && window.ethereum.isMetaMask) {
            const hasSetup = await setupNetwork()
            if (hasSetup) {
              activate(connector)
            } else {
              toast.error('Wrong Network!', {
                hideProgressBar: true,
              })
            }
          } else {
            toast.error('Wrong Network!', {
              hideProgressBar: true,
            })
          }
          if (window.localStorage.getItem('walletconnect')) {
            window.localStorage.removeItem('walletconnect')
            window.localStorage.removeItem(connectorLocalStorageKey)
          }
        } else {
          window.localStorage.removeItem(connectorLocalStorageKey)
          if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
            toast.error('No Binance Wallet', {
              hideProgressBar: true,
            })
          } else if (
            error instanceof UserRejectedRequestErrorInjected
            || error instanceof UserRejectedRequestErrorWalletConnect
            || error instanceof UserRejectedRequestError
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector
              walletConnector.walletConnectProvider = null
            }
            toast.error('Please authorize to access your account', {
              hideProgressBar: true,
            })
          } else {
            toast.error(error.message, {
              hideProgressBar: true,
            })
          }
        }
      })
    } else {
      toast.error('Unable to find connector', {
        hideProgressBar: true,
      })
    }
  }, [])

  return { login, logout }
}

export default useAuth
