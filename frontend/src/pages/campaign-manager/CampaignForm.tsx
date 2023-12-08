import React, {useState, useEffect, ChangeEvent, FormEvent} from 'react'
import { Box, TextField, Button, Icon } from '@mui/material';
import UserApi from '../../api';
import TabPanel from './TabPanel';
import { CampaignType, CampaignFormData } from '../../types/types';

type CampaignFormProps = {
    campaign: CampaignType | null;
  };


const CampaignForm: React.FC<CampaignFormProps> = ({campaign}) => {
    
    const initialFormState: CampaignFormData = {
        "name":"",
        "start_date":null,
        "duration":null,
        "customer_segment":null,
        "target_audience":"",
        "spend_email":null,
        "spend_facebook":null,
        "spend_google_ads":null,
        "spend_instagram":null,
        "spend_website":null,
        "spend_youtube":null
    }
    const [formData, setFormData] = useState<CampaignFormData>(initialFormState)

    // Update formData when the campaign prop changes
    useEffect(() => {
    if (campaign) {
        setFormData({
            name: campaign.name,
            start_date: campaign.start_date,
            duration: campaign.duration,
            customer_segment: campaign.customer_segment,
            target_audience: campaign.target_audience,
            spend_email: campaign.spend_email,
            spend_facebook: campaign.spend_facebook,
            spend_google_ads: campaign.spend_google_ads,
            spend_instagram: campaign.spend_instagram,
            spend_website: campaign.spend_website,
            spend_youtube: campaign.spend_youtube,
            });
    }
    }, [campaign]);

    const handleChange = (evt:ChangeEvent<HTMLInputElement>) => {
        const {name, value} = evt.target
        setFormData(formData => (
            {...formData,
            [name]:value}
        ))
    }

    const handleSubmit = (evt: FormEvent) => {
        evt.preventDefault();
        if(campaign){
            UserApi.updateCampaign(campaign.id, formData)
        } else {
            UserApi.addCampaign(formData)
        }
        

    } 

//function to generate TextField components that populates with campaign data if exists. Otherwise each field is blank.
//Only include fields in this order: "name", "start_date", "duration", "customer_segment", "target_audience", "spend_email", "spend_facebook", "spend_google_ads", "spend_instagram", "spend_website", "spend_youtube"

    const generateInputFields = () => {
        const inputFields = []
        const fieldNames = ["name", "start_date", "duration", "customer_segment", "target_audience", "spend_email", "spend_facebook", "spend_google_ads", "spend_instagram", "spend_website", "spend_youtube"]
        for (const fieldName of fieldNames) {
            inputFields.push(
                <TextField
                    id={fieldName}
                    name={fieldName}
                    label={fieldName}
                    variant="outlined"
                    value={formData[fieldName as keyof CampaignFormData]}
                    onChange={handleChange}
                />
            )
        }
        return inputFields
    }


    const inputFields = generateInputFields()



    return (
        <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TabPanel/>
        {inputFields}

        <Button variant="contained">{campaign ? "Update" : "Add" }</Button>
      </Box>
    )
}

export default CampaignForm