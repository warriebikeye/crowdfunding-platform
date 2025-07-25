const { ethers } = require('ethers');
const CrowdFundingABI = require('../abi/CrowdFunding.json');

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CrowdFundingABI.abi, provider);

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await contract.getCampaigns();

    const parsedCampaigns = campaigns.map((c, i) => ({
      owner: c.owner,
      title: c.title,
      description: c.description,
      target: c.target.toString(),            // BigInt → string
      deadline: c.deadline.toString(),        // BigInt → string
      amountCollected: c.amountCollected.toString(), // BigInt → string
      image: c.image,
      pId: i,
    }));

    res.status(200).json(parsedCampaigns);
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};
