const { ethers } = require('ethers');
const CrowdFundingABI = require('../abi/CrowdFunding.json');

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CrowdFundingABI.abi, provider);

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await contract.getCampaigns();
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};
