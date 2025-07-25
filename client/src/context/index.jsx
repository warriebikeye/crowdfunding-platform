import React, { useContext, createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CrowdFundingABI from '../abi/CrowdFunding.json';

const StateContext = createContext();

const contractAddress = '0x7F3ba9cF4f3d621c3f15C2fB890ADA2ddde314cB';

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      alert('Please install MetaMask and connect to proceed!');
    }
  };

  useEffect(() => {
    // Optionally auto-connect on load
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          connect(); // Auto-connect if wallet is already connected
        }
      });
    }
  }, []);

  const publishCampaign = async (form) => {
    try {
      const tx = await contract.createCampaign(
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image
      );
      await tx.wait();
      console.log("Contract call success:", tx);
    } catch (error) {
      console.log("Contract call failure:", error);
    }
  };

  const updateSearchTerm = async (term) => {
    setSearchTerm(term);
  };

  const getCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns');
      const data = await response.json();

      const parsedCampaigns = data.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: Number(campaign.deadline),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i,
      }));

      return parsedCampaigns;
    } catch (error) {
      console.error("Failed to fetch campaigns from backend:", error);
      return [];
    }
  };


  const donate = async (pId, amount) => {
    const tx = await contract.donateToCampaign(pId, {
      value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
    return tx;
  };

  const getDonations = async (pId) => {
    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        donate,
        getDonations,
        searchTerm,
        updateSearchTerm,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
