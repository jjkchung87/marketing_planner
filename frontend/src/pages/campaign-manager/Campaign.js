import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CampaignForm from './CampaignForm';
import BarChart from './CampaignBarChart';
import Insights from './CampaignInsights';
import UserApi from '../../api';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

const Campaign = () => {
  const { id: campaignId } = useParams(); // Rename id to campaignId

  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    // Check if campaignId exists and is a number
    if (campaignId && !isNaN(campaignId)) {
      async function getCampaign(id) {
        try {
          const res = await UserApi.getCampaign(id);
          setCampaign(res.campaign);
        } catch (error) {
          console.error('Error fetching campaign data:', error);
        } finally {
          setIsLoading(false);
        }
      }
      getCampaign(campaignId);
    } else {
      // No campaignId, set campaign state to null
      setCampaign(null);
      setIsLoading(false);
    }
  }, [campaignId]); // Include campaignId as a dependency

  const addOrUpdateCampaign() => {
    
  }

  return (
    <Box sx={{ width: '100%' }}>
        <h1>Campaign Manager</h1>
        <h2>name: {campaign && campaign.name}</h2>
        <h3>id: {campaign && campaign.id}</h3>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={6}>
          <CampaignForm campaign={campaign} />
        </Grid>
        <Grid xs={6}>
          {campaign && <BarChart campaign={campaign} />}
        </Grid>
        <Grid xs={6}>
          {campaign && <Insights campaign={campaign} />}
        </Grid>
        <Grid xs={6}></Grid>
      </Grid>
    </Box>
  );
};

export default Campaign;
