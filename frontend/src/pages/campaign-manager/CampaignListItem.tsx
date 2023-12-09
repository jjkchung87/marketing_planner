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
  
  type CampaignListItemProps = {
    campaign: CampaignType;
  };


  const CampaignListItem: React.FC<CampaignListItemProps> = ({campaign}) => {

    const [campaignData, setCampaignData] = useState<CampaignType | null>(null);

    useEffect(() => {
        setCampaignData(campaign)
    }, [campaignData])


    const [campaignFormData, setCampaignFormData] = useState<CampaignFormData | null>({
        name:campaign.name || null,
        start_date:campaign.start_date || null,
        duration:campaign.duration || null,
        customer_segment:campaign.customer_segment || null,
        target_audience:campaign.target_audience || null,
        spend_email:campaign.spend_email || null,
        spend_facebook:campaign.spend_facebook || null,
        spend_google_ads:campaign.spend_google_ads || null,
        spend_instagram:campaign.spend_instagram || null,
        spend_website:campaign.spend_website || null,
        spend_youtube:campaign.spend_youtube || null
    });


    const handleChange = (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {

        const { name, value } = e.target;
        setCampaignFormData((prevFormData) => ({
          ...prevFormData as CampaignFormData,
          [name]: value
        }));
      }


    const handleUpdate = async () => {
        if(!campaignFormData) return console.error('Campaign form data not found')
        const updated_campaign = await UserApi.updateCampaign(campaign.id, campaignFormData)

        setCampaignData(updated_campaign)

    }


    return (
        <TableRow key={campaign.id}>
        <StyledTableCell>
          <StyledTextField
            type="text"
            name="name"
            value={campaign.name}
            onChange={(e) => handleChange(e)}
          />
          </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="date"
            name="start_date"
            value={campaign.start_date}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="number"
            name="duration"
            value={campaign.duration}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="text"
            name="customer_segment"
            value={campaign.customer_segment}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="text"
            name="target_audience"
            value={campaign.target_audience}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="number"
            name="spend_email"
            value={campaign.spend_email}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="number"
            name="spend_facebook"
            value={campaign.spend_facebook}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="number"
            name="spend_google_ads"
            value={campaign.spend_google_ads}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="number"
            name="spend_instagram"
            value={campaign.spend_instagram}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="number"
            name="spend_website"
            value={campaign.spend_website}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTextField
            type="number"
            name="spend_youtube"
            value={campaign.spend_youtube}
            onChange={(e) => handleChange(e)}
          />
        </StyledTableCell>
        <StyledTableCell>${campaign.spend_total}</StyledTableCell>
        <StyledTableCell>${Math.floor(campaign.projected_revenue_total)}</StyledTableCell>
        <StyledTableCell>${Math.floor(campaign.actual_total_revenue)}</StyledTableCell>
        <StyledTableCell>
          <Button onClick={() => handleUpdate()}>Update</Button>
        </StyledTableCell>
      </TableRow>
    )

  }

  export default CampaignListItem;