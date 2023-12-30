import React, {useState} from 'react';
import { Button, Header, Modal, Form, Input } from 'semantic-ui-react'
import { customerSegments, targetAudiences, fieldNames } from '../../utils/commonVariables';

function AddCampaignModal({addCampaign}) {
  
  const initialFormState= {
    name: 'Test Campaign',
    start_date: '2023-12-31',
    duration: 60,
    customer_segment: '',
    target_audience: '',
    spend_email: 1000,
    spend_facebook: 1100,
    spend_google_ads: 1200,
    spend_instagram: 1300,
    spend_website: 1500,
    spend_youtube: 2000,
};
  
  const [open, setOpen] = useState(false)
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
    addCampaign(formData);
    setFormData(initialFormState);
    setOpen(false)
  };

  const generateInputFields = () => {
      return fieldNames.map((fieldName, index) => (
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
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Add new campaign</Button>}
    >
      <Modal.Header>Add new campaign</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Header>Enter campaign details</Header>
        </Modal.Description>
        <Form className="campaign-form" onSubmit={handleSubmit}>
          {inputFields}
          <Button type="submit" primary>
              Submit
          </Button>
        </Form>
      </Modal.Content>
    </Modal>

  )
}

export default AddCampaignModal;