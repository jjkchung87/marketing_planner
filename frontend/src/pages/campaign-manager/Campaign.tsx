import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CampaignForm from './CampaignForm';
import BarChart from './CampaignBarChart';
import Insights from './CampaignInsights';
import UserApi from '../../api';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { CampaignType } from '../../types/types';



const Campaign = () => {
  // get campaignID from URL params using useParams(), as a numeric value
  const { campaignId } = useParams<{ campaignId: string }>();

  //convert campaignId to a number
  const campaignIdNumber = Number(campaignId);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<CampaignType | null>(null);

  useEffect(() => {
    if (campaignId && !isNaN(Number(campaignId))) {
      async function getCampaign(id: number): Promise<void> {
        try {
          const res = await UserApi.getCampaign(id);
          setCampaign(res.campaign);
        } catch (error) {
          console.error('Error fetching campaign data:', error);
        } finally {
          setIsLoading(false);
        }
      }
      getCampaign(campaignIdNumber);
    } else {
      setCampaign(null);
      setIsLoading(false);
    }
  }, [campaignId]);

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
          {/* {campaign && <Insights campaign={campaign}/>} */}
        </Grid>
        <Grid xs={6}></Grid>
      </Grid>
    </Box>
  );
};

export default Campaign;
