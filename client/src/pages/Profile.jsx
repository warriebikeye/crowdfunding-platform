import React, { useState, useEffect } from 'react'
import { useLocation} from 'react-router-dom';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { state } = useLocation();
  const { address, contract, getCampaigns, searchTerm } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    const ownerCampaigns = data.filter(campaign => campaign.owner.toLowerCase() === address);
    setCampaigns(ownerCampaigns);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

   const filteredCampaigns = searchTerm
    ? ownerCampaigns.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : ownerCampaigns;

  return (
    <DisplayCampaigns 
      title="Your Campaigns"
      isLoading={isLoading}
      campaigns={filteredCampaigns}
    />
  )
}

export default Profile