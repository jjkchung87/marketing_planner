import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import { Form, Input, Button, Grid } from 'semantic-ui-react';
import UserApi from '../../api';
import { CampaignFormData } from '../../types/types';
import UserContext from '../../context/UserContext';

const CampaignForm= () => {

    const initialFormState= {
        name: 'Test Campaign',
        start_date: '2023-12-31',
        duration: 60,
        customer_segment: 'All Ages',
        target_audience: 'Tech Enthusiasts',
        spend_email: 1000,
        spend_facebook: 1100,
        spend_google_ads: 1200,
        spend_instagram: 1300,
        spend_website: 1500,
        spend_youtube: 2000,
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        UserApi.addCampaign(formData);
        setFormData(initialFormState);
    };

    const generateInputFields = () => {
        const fieldNames = ['name', 'start_date', 'duration', 'customer_segment', 'target_audience', 'spend_email', 'spend_facebook', 'spend_google_ads', 'spend_instagram', 'spend_website', 'spend_youtube'];
        return fieldNames.map((fieldName, index) => (
            <Form.Field key={fieldName}>
                <label>{fieldName}</label>
                <Input
                    type={fieldName === 'start_date' ? 'date' : 'text'}
                    onChange={handleChange}
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName] || ''}
                />
            </Form.Field>
        ));
    };

    const inputFields = generateInputFields();

    return (
        <div>
            <h1>Campaign Manager</h1>
            <Grid columns={2} divided>
                <Grid.Row>
                    <Grid.Column width={3}>
                    <Form className="campaign-form" onSubmit={handleSubmit}>
                        {inputFields}
                        <Button type="submit" primary>
                            Submit
                        </Button>
                    </Form>
                    </Grid.Column>
                    <Grid.Column width={9}>
                        <Grid>
                            <Grid.Row>
                                CHART 1 - Bar chart: Spend vs. Projected Revenue by Channel
                            </Grid.Row>
                            <Grid.Row>
                                <div>CHART 2 - Mixed Bar and Line Chart: Revenue and ROI by campaign (Consumer Segment)</div>
                            </Grid.Row>
                            <Grid.Row>
                                <div>CHART 3 - Mixed Bar and Line Chart: Revenue and ROI by campaign (Target Audience)</div>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        </div>
        
    );
};

export default CampaignForm;
