import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import UserApi from '../../api';
import { Icon, Menu, Table, Grid} from 'semantic-ui-react'
import { CampaignType, CampaignFormData } from '../../types/types';
import "./CampaignList.css";
import CampaignListItem from './CampaignListItem2';
import MonthlyChart from './MonthlyChart';
import AddCampaignModal from './AddCampaignModal';
import CampaignListFilter from './CampaignListFilter'



const CampaignList = () => {


  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState(null);
  

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await UserApi.getCampaigns();
        setCampaigns(res);
        localStorage.setItem('campaigns', JSON.stringify(res));
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const savedCampaigns = localStorage.getItem('campaigns');
    
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns));
      setIsLoading(false);
    } else {
      fetchCampaigns();
    }
  }, []);

  const addCampaign = async (campaignData) => {
    try {
      const res = await UserApi.addCampaign(campaignData);
      const updatedCampaigns = [...campaigns, res.campaign];
      setCampaigns(updatedCampaigns);
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    } catch (error) {
      console.error('Error adding campaign:', error);
    }
  };


  const updateCampaign = async (campaignId, campaignData) => {
    try {
      const res = await UserApi.updateCampaign(campaignId, campaignData);
      const updatedCampaigns = campaigns.map((campaign) => {
        if (campaign.id === campaignId) {
          return res.campaign;
        }
        return campaign;
      });
      setCampaigns(updatedCampaigns);
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      await UserApi.deleteCampaign(campaignId);
      const updatedCampaigns = campaigns.filter(
        (campaign) => campaign.id !== campaignId
      );
      setCampaigns(updatedCampaigns);
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  
  const tableHeaders = ['Campaign Name', 'Start Date', 'Duration', 'Customer Segment', 'Target Audience', 'Email Spend', 'Facebook Spend', 'Google Spend', 'Instagram Spend', 'Website Spend', 'Youtube Spend', 'Total Spend', 'Projected Revenue', 'Actual Revenue', 'Edit', 'Delete']


  if(isLoading) return <h1>Loading...</h1>

  return (
    <div className="campaign-list-container">
    <Grid divided="vertically">
      <Grid.Row className="campaign-list-chart">
        <MonthlyChart campaigns={campaigns}/>

        <AddCampaignModal addCampaign={addCampaign}/>
      </Grid.Row>
      <Grid.Row className="campaign-list-filter">
        <CampaignListFilter campaigns={campaigns} setCampaigns={setCampaigns}/>
      </Grid.Row>
      <Grid.Row className="campaign-list-table">
        <Table  sortable compact >
        <Table.Header className="fixed-header" >
          <Table.Row>
            {tableHeaders.map((header) => (
              <Table.HeaderCell >{header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body className="scrollable-body">
          {campaigns && campaigns.map((campaign) => (
            <CampaignListItem campaign={campaign} updateCampaign={updateCampaign} deleteCampaign={deleteCampaign}/>
          ))}
        </Table.Body>
      </Table>
      </Grid.Row>
    </Grid>
    </div>
  );
};

export default CampaignList;
