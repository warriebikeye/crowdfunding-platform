import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const { address, contract, getCampaigns, searchTerm } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    //if (contract) fetchCampaigns();
    fetchCampaigns();
  }, [address, contract]); 

  const filteredCampaigns = searchTerm
    ? campaigns.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : campaigns;

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={filteredCampaigns}
    />
  )
}

export default Home