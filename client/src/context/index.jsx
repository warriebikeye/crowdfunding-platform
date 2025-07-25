import React, { useContext, createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CrowdFundingABI from '../abi/CrowdFunding.json';

const StateContext = createContext();

const contractAddress = '0x7F3ba9cF4f3d621c3f15C2fB890ADA2ddde314cB';
const defaultRPC = 'https://rpc.sepolia.org';

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [readOnlyProvider] = useState(() => new ethers.providers.JsonRpcProvider(defaultRPC));
  const [readOnlyContract] = useState(() => new ethers.Contract(contractAddress, CrowdFundingABI.abi, readOnlyProvider));

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];
        setAddress(userAddress);

        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        const tempSigner = tempProvider.getSigner();
        const crowdfundingContract = new ethers.Contract(contractAddress, CrowdFundingABI.abi, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(crowdfundingContract);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    // Auto-connect if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          connect();
        }
      });
    }
  }, []);

  const updateSearchTerm = (term) => {
    setSearchTerm(term);
  };

  // ✅ getCampaigns uses contract if available, else falls back to read-only
  const getCampaigns = async () => {
    try {
      const campaigns = await (contract || readOnlyContract).getCampaigns();
      return campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i,
      }));
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
      return [];
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        getCampaigns, // ✅ Only exporting getCampaigns
        searchTerm,
        updateSearchTerm,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
