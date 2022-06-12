import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Container from './components/Container'
import Footer from './components/Footer'
import { UserIcon, LightningBoltIcon, XIcon } from '@heroicons/react/outline'
import logo from './assets/logo.svg'
import myEpicNft from './utils/MyEpicNFT.json'
import toast, { Toaster } from 'react-hot-toast'
import clsx from 'clsx'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

// Constants
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/squarenft-p7sxaztrc5'
const TOTAL_MINT_COUNT = 50

type NotifyMessage = {
  title: string
  message: string
}

const notify = ({ title, message }: NotifyMessage) =>
  toast.custom(
    (t) => (
      <div
        className={clsx(
          'relative flex w-96 translate-y-0 transform-gpu flex-row items-center justify-between bg-cyan-900 px-4 py-6 shadow-2xl transition-all duration-500 ease-in-out hover:translate-y-1 hover:shadow-none lg:w-96',
          t.visible ? 'top-0' : '-top-96'
        )}
      >
        <div className="w-12 shrink-0">
          <span className="text-3xl">✨</span>
        </div>
        <div className="ml-4 flex-1 cursor-default overflow-hidden">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <div className="mt-2 whitespace-normal text-sm text-cyan-100">
            <div dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        </div>
        <div
          className="absolute top-2 right-2 cursor-pointer text-white"
          onClick={() => toast.dismiss(t.id)}
        >
          <XIcon className="h-6 w-6" />
        </div>
      </div>
    ),
    { id: 'unique-notification', position: 'top-center' }
  )

function App() {
  const [currentAccount, setCurrentAccount] = useState()
  const [mintedNfts, setMintedNfts] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const [showConfetti, setShowConfetti] = useState<Boolean>(false)

  const { width, height } = useWindowSize()
  const CONTRACT_ADDRESS = '0x5CFD05616D34Fe14c36E56A353f69f4B31D8C8dc'

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
      setCurrentAccount(account)
      setupEventListener()
    } else {
      console.log('No authorized account found')
    }
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain ' + chainId)

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = '0x4'
    if (chainId !== rinkebyChainId) {
      notify({
        title: 'Wrong network',
        message: 'You are not connected to the Rinkeby Test network!',
      })
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
      // setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      // @ts-ignore
      const { ethereum } = window

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
          console.log('From:', from, tokenId.toNumber())
          // alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          notify({
            title: 'NFT minted!',
            message: `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <a class="mt-4 block font-bold truncate hover:text-cyan-100" href="https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}">https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}</a>`,
          })
          setShowConfetti(false)
        })

        console.log('Setup event listener!')
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        let nftTxn = await connectedContract.makeAnEpicNFT()
        setIsLoading(true)
        console.log('Mining...please wait.')
        await nftTxn.wait()
        setIsLoading(false)
        // let amountNfts = await connectedContract.getTotalNFTsMintedSoFar()
        // amountNfts = amountNfts.toNumber()
        setShowConfetti(true)
        // console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const hanleMintedNfts = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)
        let amountNfts = await connectedContract.getTotalNFTsMintedSoFar()
        setMintedNfts(amountNfts.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="relative flex h-8 items-center justify-center bg-cyan-800 px-2 text-white transition-all before:absolute before:top-0.5 before:left-0.5 before:z-[-1] before:h-full before:w-full before:bg-teal-400 hover:bg-slate-700 hover:before:bg-teal-300"
    >
      Connect to Wallet
    </button>
  )

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected()
    hanleMintedNfts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-gradient-to-b from-cyan-50 to-teal-100 font-mono antialiased">
      {showConfetti && <Confetti width={width} height={height} />}
      <Container>
        <header className="fixed inset-x-0 h-12 bg-teal-600/10 backdrop-blur-sm">
          <div className="flex h-12 items-center justify-between px-4 lg:mx-auto lg:max-w-4xl">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Wave Portal" className="h-8 w-8 rounded" />
              <span className="bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-500 bg-clip-text text-xl font-bold text-transparent">
                My NFT Coll<span className="sm:hidden">.</span>
                <span className="hidden sm:inline-block">ection</span>
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
            <span className="bg-gradient-to-r from-cyan-700 via-cyan-500 to-teal-600 bg-clip-text font-bold text-transparent">
              My NFT Collection
            </span>
          </h1>
          <div className="mt-4 flex w-full flex-col items-center justify-center lg:mt-8">
            <div className="text-center font-semibold">
              <p className="mt-2 mb-1">🛎️ Only 50 NFTs can be minted!</p>
              <p className="mt-2 mb-1">🙌 So, hurry up to get your NFT!!</p>
            </div>
            <div className="relative mt-4 flex items-center justify-center space-x-2 bg-cyan-800 px-6 py-3 text-white">
              <span className="animate-pulse text-cyan-200">{mintedNfts}</span>{' '}
              <span className="text-teal-400">/</span>{' '}
              <span className="text-cyan-300">{TOTAL_MINT_COUNT}</span>
            </div>
            <div className="mt-1 text-xs text-cyan-700">minted so far</div>
          </div>
          <div className="mt-4 flex justify-center">
            {currentAccount === '' ? (
              renderNotConnectedContainer()
            ) : (
              <button
                onClick={askContractToMintNft}
                className={clsx(
                  'relative flex h-12 w-36 items-center justify-center px-4 py-2 ring-1 ring-transparent transition-all focus:ring-cyan-400',
                  isLoading
                    ? 'bg-cyan-500 text-white'
                    : 'bg-cyan-600 text-white hover:bg-slate-700 hover:text-cyan-200 focus:ring-cyan-500'
                )}
              >
                {isLoading ? (
                  <div className="flex w-full items-center justify-center">
                    <svg
                      className="-ml-1 mr-3 h-6 w-6 animate-spin text-cyan-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="animate-pulse text-cyan-100">Mining...</span>
                  </div>
                ) : (
                  <span>Mint NFT</span>
                )}
              </button>
            )}
          </div>
          <div className="mt-8 text-center">
            <a
              href={OPENSEA_LINK}
              className="font-medium text-cyan-900 hover:text-teal-500"
              target="_blank"
              rel="noreferrer"
            >
              🌊 View Collection on OpenSea
            </a>
          </div>
        </main>
        <Toaster />
        <Footer />
      </Container>
    </div>
  )
}

export default App
