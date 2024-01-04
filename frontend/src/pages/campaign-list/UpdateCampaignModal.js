import React, {useState} from 'react';
import { Button, Header, Modal, Form, Input, Icon } from 'semantic-ui-react'
import { customerSegments, targetAudiences, fieldNames } from '../../utils/commonVariables';

function UpdateCampaignModal({campaign, updateCampaign, closeModal, open}) {
  
  const initialCampaignState= {
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
    spend_total: campaign.spend_total,
    projected_revenue_email: campaign.projected_revenue_email,
    projected_revenue_facebook: campaign.projected_revenue_facebook,
    projected_revenue_google_ads: campaign.projected_revenue_google_ads,
    projected_revenue_instagram: campaign.projected_revenue_instagram,
    projected_revenue_website: campaign.projected_revenue_website,
    projected_revenue_youtube: campaign.projected_revenue_youtube,
    projected_revenue_total: campaign.projected_revenue_total
    };

  
  const [formData, setFormData] = useState({
    name: campaign.name,
    start_date: campaign.start_date,
    duration: campaign.duration,
    customer_segment: campaign.customer_segment,
    target_audience: campaign.target_audience,
    spend_email: campaign.spend_email,
    spend_google_ads: campaign.spend_google_ads,
    spend_facebook: campaign.spend_facebook,
    spend_instagram: campaign.spend_instagram,
    spend_website: campaign.spend_website,
    spend_youtube: campaign.spend_youtube
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((formData) => ({
        ...formData,
        [name]: value,
    }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    updateCampaign(formData);
  };

  const generateInputFields = () => {
      return fieldNames.map((fieldName) => (
          <Form.Field key={fieldName}>
              <label>{fieldName}</label>
              {fieldName === 'customer_segment' ? (
                  <select
                      name={fieldName}
                      value={formData[fieldName]}
                      onChange={handleChange}
                  >
                      {customerSegments.map((segment) => (
                          <option key={segment} value={segment}>
                              {segment}
                          </option>
                      ))}
                  </select>
              ) : fieldName === 'target_audience' ? (
                  <select
                      name={fieldName}
                      value={formData[fieldName]}
                      onChange={handleChange}
                  >
                      {targetAudiences.map((audience) => (
                          <option key={audience} value={audience}>
                              {audience}
                          </option>
                      ))}
                  </select>
              ) : (
              <Input
                  type={fieldName === 'start_date' ? 'date' : 'text'}
                  onChange={handleChange}
                  id={fieldName}
                  name={fieldName}
                  value={formData[fieldName] || ''}
              />)}
          </Form.Field>
    ));
  };

  const inputFields = generateInputFields();
  
  return (


    <Modal
      closeIcon
      onClose={closeModal}
      open={open}
    >
      <Modal.Header>Update Campaign</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Header>Enter campaign details</Header>
        </Modal.Description>
        <Form className="campaign-form" onSubmit={handleSubmit}>
          {inputFields}
          <Button color='red' onClick={closeModal}>
          <Icon name='remove' /> Cancel
          </Button>
          <Button type="submit" primary>
          <Icon name='checkmark' />
              Submit
          </Button>
        </Form>
      </Modal.Content>
    </Modal>

  )
}

export default UpdateCampaignModal;