import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Container from './components/Container'
import Footer from './components/Footer'
import { UserIcon, LightningBoltIcon } from '@heroicons/react/outline'
import Loading from './components/Loading'
import logo from './assets/logo.svg'

// Constants
const OPENSEA_LINK = ''
const TOTAL_MINT_COUNT = 50

function App() {
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="relative flex h-8 items-center justify-center bg-cyan-800 px-2 text-white transition-all before:absolute before:top-0.5 before:left-0.5 before:z-[-1] before:h-full before:w-full before:bg-teal-400 hover:bg-slate-700 hover:before:bg-teal-300"
    >
      Connect to Wallet
    </button>
  )
  const [currentAccount, setCurrentAccount] = useState()
  const contractAddress = '0x6e76563C444F2bABDA96039d6c73E6192f8d9aCB'
  // const contractABI = abi.abi

  const checkIfWalletIsConnected = async () => {
    /*
     * First make sure we have access to window.ethereum
     */
    // @ts-ignore
    const { ethereum } = window

    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }

    /*
     * Check if we're authorized to access the user's wallet
     */
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    /*
     * User can have multiple authorized accounts, we grab the first one if its there!
     */
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account:', account)
      setCurrentAccount(account)
    } else {
      console.log('No authorized account found')
    }
  }

  const connectWallet = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window
      if (!ethereum) {
        alert('Get metamask')
        return
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="bg-gradient-to-b from-cyan-50 to-teal-100 font-mono antialiased">
      <Container>
        <header className="fixed inset-x-0 h-12 bg-teal-600/10 backdrop-blur-sm">
          <div className="flex h-12 items-center justify-between px-4 lg:mx-auto lg:max-w-4xl">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Wave Portal" className="h-8 w-8 rounded" />
              <span className="bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-500 bg-clip-text text-xl font-bold text-transparent">
                My NFT Collection
              </span>
            </div>
            <div className="flex items-center">
              {currentAccount ? (
                <button className="relative flex h-8 max-w-[96px] items-center justify-center bg-cyan-500 px-2 text-white transition-all before:absolute before:top-0.5 before:left-0.5 before:z-[-1] before:h-full before:w-full before:bg-teal-400 hover:bg-slate-700 hover:before:bg-teal-300">
                  <UserIcon className="h-6 w-6 shrink-0" />
                  <span className="truncate">{currentAccount}</span>
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="relative flex h-8 items-center justify-center bg-cyan-800 px-2 text-white transition-all before:absolute before:top-0.5 before:left-0.5 before:z-[-1] before:h-full before:w-full before:bg-teal-400 hover:bg-slate-700 hover:before:bg-teal-300"
                >
                  <LightningBoltIcon className="h-6 w-6" />
                  <span className="hidden sm:block">Login</span>
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="mt-14 w-full flex-1 px-4 lg:mx-auto lg:max-w-4xl">
          <h1 className="mt-1 mb-2 text-center text-3xl font-bold">
            👋{' '}
            <span className="bg-gradient-to-r from-cyan-700 via-cyan-500 to-teal-600 bg-clip-text text-transparent">
              My NFT Collection
            </span>
          </h1>
          <div className="flex justify-center mt-4">
            {currentAccount === '' ? (
              renderNotConnectedContainer()
            ) : (
              <button className="relative flex h-10 items-center justify-center bg-cyan-500 px-4 text-white transition-all before:absolute before:top-0.5 before:left-0.5 before:z-[-1] before:h-full before:w-full before:bg-teal-400 hover:bg-slate-700 hover:before:bg-teal-800">
                Mint NFT
              </button>
            )}
          </div>
        </main>

        <Footer />
      </Container>
    </div>
  )
}

export default App
