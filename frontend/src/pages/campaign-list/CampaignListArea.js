import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import UserApi from '../../api';

import { CampaignType, CampaignFormData } from '../../types/types';
import "./CampaignList.css";
import MonthlyChart from './MonthlyChart';
import AddCampaignModal from './AddCampaignModal';
import CampaignListFilter from './CampaignListFilter'
import CampaignsContext from '../../context/CampaignsContext';
import CampaignListTable from './CampaignListTable';



const CampaignListArea = () => {


	const [isLoading, setIsLoading] = useState(true);
	const [campaigns, setCampaigns] = useState(null);
	const [filteredCampaigns, setFilteredCampaigns] = useState(null);


	useEffect(() => {
		const fetchCampaigns = async () => {
			try {
				const res = await UserApi.getCampaigns();
				setCampaigns(res);
				setFilteredCampaigns(res);
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
			setFilteredCampaigns(JSON.parse(savedCampaigns));
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


	const filterCampaigns = (filter) => {

		console.log('Filters:', filter);

		let filteredCampaigns = campaigns;
		if (filter.customer_segment.length > 0) {
		filteredCampaigns = filteredCampaigns.filter((campaign) => filter.customer_segment.includes(campaign.customer_segment));
		}
		if (filter.target_audience.length > 0) {
		filteredCampaigns = filteredCampaigns.filter((campaign) => filter.target_audience.includes(campaign.target_audience));
		}
		if (filter.start_date.length > 0) {
		filteredCampaigns = filteredCampaigns.filter((campaign) => {
			const startDate = new Date(campaign.start_date);
			const startDateString = startDate.toISOString().split('T')[0];
			return filter.start_date.includes(startDateString);
		});
		}
		if (filter.duration.length > 0) {
		filteredCampaigns = filteredCampaigns.filter((campaign) => filter.duration.includes(campaign.duration));
		}

		setFilteredCampaigns(filteredCampaigns);
	};


  if(isLoading) return <h1>Loading...</h1>

  return (
    <CampaignsContext.Provider value={{ campaigns, filteredCampaigns, setCampaigns, addCampaign, deleteCampaign, updateCampaign, filterCampaigns }}>
    <div className="campaign-list-container">
      <div className="campaign-list-chart">
        <MonthlyChart/>
        <AddCampaignModal addCampaign={addCampaign}/>
      </div>
      <div className="campaign-list-filter">
        <CampaignListFilter/>
      </div>
      <div className="campaign-list-table">
        <CampaignListTable/>
      </div>
    </div>
    </CampaignsContext.Provider>
  );
};

export default CampaignListArea;
