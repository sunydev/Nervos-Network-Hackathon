/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';

import { SimpleStorageWrapper } from '../lib/contracts/SimpleStorageWrapper';

const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");


export function App() {
    const [web3, setWeb3] = useState<Web3>();
    const [contract, setContract] = useState<SimpleStorageWrapper>();
    const [accounts, setAccounts] = useState<string[]>();
    const [balance, setBalance] = useState<bigint>();
    const [existingContractIdInputValue, setExistingContractIdInputValue] = useState<string>();
    const [storedValue, setStoredValue] = useState<number | undefined>();
    const [transactionInProgress, setTransactionInProgress] = useState(false);
    const toastId = React.useRef(null);
    const [newStoredNumberInputValue, setNewStoredNumberInputValue] = useState<
        number | undefined
    >();

    const [purchasedTracks, addTrack] = useState<string[]>([]);
    const [track, setTrack] = useState<string>();

    const useAudio = url => {

      const [audio] = useState(new Audio(url));
      const [playing, setPlaying] = useState(false);
      const toggle = () => setPlaying(!playing);

      useEffect(() => {
        playing ? audio.play() : audio.pause();
      },
      [playing]
     );

     useEffect(() => {
      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
     }, []);

    return [playing, toggle];
  };

  const Player = ({ url }) => {
    const [playing, toggle] = useAudio(url);

    return (
      <div>
        <button onClick={toggle} disabled={!track}>{playing ? "Pause" : "Play"} </button>
      </div>
    );
  };

  useEffect(() => {
      if (web3) {
          return;
      }

      (async () => {
           const GODWOKEN_RPC_URL = 'https://godwoken-testnet-web3-rpc.ckbapp.dev';
           const polyjuiceConfig = {
                rollupTypeHash: '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
                ethAccountLockCodeHash: '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
                web3Url: GODWOKEN_RPC_URL
              };

          const provider = new PolyjuiceHttpProvider(
              GODWOKEN_RPC_URL,
              polyjuiceConfig,
            );

          const _web3 = new Web3(provider);
          setWeb3(_web3);

          const _accounts = [(window as any).ethereum.selectedAddress];
          setAccounts(_accounts);
          console.log({ _accounts });

          if (_accounts && _accounts[0]) {
              const _l2Balance = BigInt(await _web3.eth.getBalance(_accounts[0]));
              setBalance(_l2Balance);

              deployContract(_web3,_accounts);
          }
      })();
  });


    useEffect(() => {
        if (transactionInProgress && !toastId.current) {
            toastId.current = toast.info(
                'Transaction in progress. Confirm MetaMask signing dialog and please wait...',
                {
                    position: 'top-right',
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    closeButton: false
                }
            );
        } else if (!transactionInProgress && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [transactionInProgress, toastId.current]);

    const account = accounts?.[0];

    async function deployContract(_web,_accounts) {

        const _contract = new SimpleStorageWrapper(_web);
        const account2 =_accounts?.[0];

        try {
            setTransactionInProgress(true);

            await _contract.deploy(account2);

            setExistingContractAddress(_contract.address, _web);
            toast(
                'Successfully deployed a smart-contract. You can now proceed buy then listen to your tracks.',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast('There was an error sending your transaction. Please check developer console.');
        } finally {
            setTransactionInProgress(false);
        }
    }



    async function setExistingContractAddress(contractAddress: string, _web) {
        const _contract = new SimpleStorageWrapper(_web);
        _contract.useDeployed(contractAddress.trim());

        setContract(_contract);
        setStoredValue(undefined);
    }



    async function buyTrack(id, buyer, owner, price) {

       let res = await contract.payTrack(arguments[0].price,buyer);
       toast(`Successfully purchased. Receipt Tx: ${res.transactionHash}`, { type: 'success' });

       const tk = [
        ...purchasedTracks,
        arguments[0].id
       ];

        addTrack(tk);

        const _l2Balance = BigInt(await web3.eth.getBalance(accounts[0]));
          console.log(_l2Balance);
        setBalance(_l2Balance);
    }

    const LoadingIndicator = () => <span className="rotating-icon">⚙️</span>;
    const PlayTrack = (url,label)=>(<button onClick={()=>setTrack(url)} >Listen </button> );
    const BuyTrack = (id, price) =>(<div>  Buy now <button onClick={()=>buyTrack(id, account, contract.address, price)}>Buy</button></div>);

    return (
        <div>
            Your ETH address: <b>{accounts?.[0]}</b>
            <br />
            <br />
            Balance: <b>{balance ? (balance).toString() : <LoadingIndicator />} WEI</b>
            <br />
            <br />
            Deployed contract address: <b>{contract?.address || '-'}</b> <br />
            <br />
            <hr />


            <br />
            <br />
            <br />
            <br />
            <hr />

            {!contract?.address ||
            <div>Playlist Music
            <ul>
            <li>
            <p>1.Peppy squad</p>
            <p>Price: 50000 Wei</p>
            {(purchasedTracks.indexOf(49)>-1)?<PlayTrack url={"https://sampleswap.org/mp3/artist/5101/Peppy--The-Firing-Squad_YMXB-160.mp3"} label={'Peppy squad'}/>: <BuyTrack id={49} price={50000}/>}
            </li>
            <li>
            <p>2.belabar sunny</p>
            <p>Price: 20000 Wei</p>
            {(purchasedTracks.indexOf(40)>-1)?<PlayTrack url={"https://sampleswap.org/mp3/artist/20409/belabar_Sunny9-160.mp3"} label={'belabar sunny'}/>: <BuyTrack id={40} price={20000}/>}

            </li>
            <li>
            <p>3.Seed AI</p>
            <p>Price: 2000 Wei</p>
            {(purchasedTracks.indexOf(10)>-1)?<PlayTrack url={"https://sampleswap.org/mp3/artist/6536/Seed-AI_2D-160.mp3"} label={'Seed AI'}/>: <BuyTrack id={10} price={2000}/>}
            </li>
            <li>
            <p>4.Audiophyla</p>
            <p>Price: 1000 Wei</p>
            {(purchasedTracks.indexOf(5)>-1)?<PlayTrack url={"https://sampleswap.org/mp3/artist/28165/harvestfred_-PRIMAVARA--160.mp3"} label={'Primavara'}/>: <BuyTrack id={5} price={1000}/>}

            </li>
            </ul>
            <p>{track?.label || '-'}</p>
            <Player url={track?.url || null }/>
            </div>

          }
            <ToastContainer />
        </div>
    );
}
