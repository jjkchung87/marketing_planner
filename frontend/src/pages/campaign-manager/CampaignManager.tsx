import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import CampaignForm from './CampaignForm';
import BarChart from './CampaignBarChart';
import Insights from './CampaignInsights';
import UserApi from '../../api';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Table, TableBody, TableCell as MuiTableCell, TableContainer, TableHead, TableRow, TextField as MuiTextField, Button } from '@mui/material';
import { styled } from '@mui/system'
import { CampaignType, CampaignFormData } from '../../types/types';
import "./CampaignManager.css";
import CampaignListItem from './CampaignListItem';

// Define your styled components
const StyledTableCell = styled(MuiTableCell)({
  padding: '6px 8px', // Smaller padding
  fontSize: '0.75rem', // Smaller font size
  '&:last-child': {
    paddingRight: '6px', // Adjust padding for the last cell
  },
});

const StyledTextField = styled(MuiTextField)({
  '& .MuiInputBase-input': {
    fontSize: '0.75rem', // Smaller font size
    padding: '6px', // Adjust padding to fit the smaller cell
  },
});

// Narrower cells for Duration, Spend, and Revenue columns
const NarrowCell = styled(StyledTableCell)({
  width: '64px',
});

const NarrowTextField = styled(StyledTextField)({
  '& .MuiInputBase-input': {
    width: '64px',
  },
});

const CampaignManager = () => {


  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaigns, setCampaigns] = useState<CampaignType[] | null>(null);
  

  // const handleUpdateCampaigns = (campaign: CampaignType) => {

  //   const updatedCampaigns:CampaignType[] = campaigns?.map((c) => {
  //     if(c.id === campaign.id){
  //       return campaign;
  //     }
  //     return c;
  //   })
  //   setCampaigns(updatedCampaigns);

  // }


  useEffect(() => {
      async function getCampaigns(): Promise<void> {
        try {
          const res = await UserApi.getCampaigns();
          setCampaigns(res);
        } catch (error) {
          console.error('Error fetching campaign data:', error);
        } finally {
          setIsLoading(false);
        }
      }
      getCampaigns();
    } 
  , [campaigns]);

  if(isLoading) return <h1>Loading...</h1>

  return (
    <Box sx={{ width: '100%' }}>
      <h1>Campaign Manager</h1>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={12}>
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Campaign Name</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <NarrowCell>Duration</NarrowCell>
              <StyledTableCell>Customer Segment</StyledTableCell>
              <StyledTableCell>Target Audience</StyledTableCell>
              <StyledTableCell>Email Spend</StyledTableCell>
              <StyledTableCell>Facebook Spend</StyledTableCell>
              <StyledTableCell>Google Spend</StyledTableCell>
              <StyledTableCell>Instagram Spend</StyledTableCell>
              <StyledTableCell>Website Spend</StyledTableCell>
              <StyledTableCell>Youtube Spend</StyledTableCell>
              <StyledTableCell>Total Spend</StyledTableCell>
              <StyledTableCell>Projected Revenue</StyledTableCell>
              <StyledTableCell>Actual Revenue</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns && campaigns.map((campaign) => (
              <CampaignListItem campaign={campaign}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </Grid>
        <Grid xs={6}>
          {/* {campaign && <Insights campaign={campaign}/>} */}
        </Grid>
        <Grid xs={6}></Grid>
      </Grid>
    </Box>
  );
};

export default CampaignManager;
