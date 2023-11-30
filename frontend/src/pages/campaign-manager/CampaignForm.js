import React, {useState, useEffect} from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import UserApi from '../../api';
import TabPanel from './TabPanel';


const CampaignForm = ({campaign}) => {
    
    const initialFormState = {
        "name":"",
        "start_date":null,
        "duration":null,
        "customer_segment":"",
        "target_audience":"",
        "spend_email":null,
        "spend_facebook":null,
        "spend_google_ads":null,
        "spend_instagram":null,
        "spend_website":null,
        "spend_youtube":null
    }
    const [formData, setFormData] = useState( campaign ? campaign : initialFormState)

    // Update formData when the campaign prop changes
    useEffect(() => {
    if (campaign) {
        setFormData(campaign);
    }
    }, [campaign]);

    const handleChange = (evt) => {
        const {name, value} = evt.target
        setFormData(formData => (
            {...formData,
            [name]:value}
        ))
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if(campaign){
            UserApi.updateCampaign(formData)
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
                    value={formData[fieldName]}
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

        <Button variant="contained">{campaign ? Update: Add }</Button>
      </Box>
    )
}

export default CampaignForm