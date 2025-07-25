const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// Route: GET /api/campaigns
router.get('/', campaignController.getAllCampaigns);

module.exports = router;
