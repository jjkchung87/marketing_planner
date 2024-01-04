import React, { useState, useEffect, ChangeEvent, useContext} from 'react';
import UserApi from '../../api';
import { Table } from 'semantic-ui-react'
import { CampaignType, CampaignFormData } from '../../types/types';
import "./CampaignList.css";
import campaignsContext from '../../context/CampaignsContext';
import UpdateCampaignModal from './UpdateCampaignModal';

type CampaignListItemProps = {
	campaign: CampaignType;
};


const CampaignListItem: React.FC<CampaignListItemProps> = ({ campaign }) => {

	const { updateCampaign, deleteCampaign} = useContext(campaignsContext);
	const [isModalOpen, setIsModalOpen] = useState(false);


	const [campaignFormData, setCampaignFormData] = useState<CampaignFormData>({
	name: campaign.name || '',
	start_date: campaign.start_date || '',
	duration: campaign.duration || 0,
	customer_segment: campaign.customer_segment || '',
	target_audience: campaign.target_audience || '',
	spend_email: campaign.spend_email || 0,
	spend_facebook: campaign.spend_facebook || 0,
	spend_google_ads: campaign.spend_google_ads || 0,
	spend_instagram: campaign.spend_instagram || 0,
	spend_website: campaign.spend_website || 0,
	spend_youtube: campaign.spend_youtube || 0
});

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
	const { name, value } = e.target;
	setCampaignFormData(prevFormData => ({
	...prevFormData,
	[name]: value
	}));
};

const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
	const { name, value } = e.target;
	setCampaignFormData(prevFormData => ({
	...prevFormData,
	[name]: value,
	}));
};


const handleDelete = async () => {
	deleteCampaign(campaign.id)
};

const openUpdateCampaignModal = () => {
    setIsModalOpen(true);
  };

  const closeUpdateCampaignModal = () => {
    setIsModalOpen(false);
  };

// isEditable if campaign start date is in the future
const isEditable = () => {
	const today = new Date();
	const startDate = new Date(campaign.start_date);
	return startDate > today;
}

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-US', {
	  style: 'currency',
	  currency: 'USD',
	  minimumFractionDigits: 0, // No decimal places
	  maximumFractionDigits: 0, // No decimal places
	}).format(amount);
  };

const customerSegments = ["Fashionistas", 
							"Foodies", 
							"Health & Wellness",
							"Outdoor Adventurers", 
							"Tech Enthusiasts"
							]
const targetAudiences = ["All Ages", 
							"Men 18-24", 
							"Men 25-34", 
							"Women 25-34", 
							"Women 35-44"]





return (
	<>
		<Table.Row key={campaign.id} >
			<Table.Cell collapsing>{ campaign.name}</Table.Cell>
			<Table.Cell collapsing>{ campaign.start_date}</Table.Cell>
			<Table.Cell collapsing>{ campaign.duration}</Table.Cell>
			<Table.Cell collapsing>{ campaign.customer_segment}</Table.Cell>
			<Table.Cell collapsing>{ campaign.target_audience}</Table.Cell>
			<Table.Cell collapsing>{ formatCurrency(campaign.spend_email)}</Table.Cell>
			<Table.Cell collapsing>{ formatCurrency(campaign.spend_facebook)}</Table.Cell>
			<Table.Cell collapsing>{ formatCurrency(campaign.spend_google_ads)}</Table.Cell>
			<Table.Cell collapsing>{ formatCurrency(campaign.spend_instagram)}</Table.Cell>
			<Table.Cell collapsing>{ formatCurrency(campaign.spend_website)}</Table.Cell>
			<Table.Cell collapsing>{ formatCurrency(campaign.spend_youtube)}</Table.Cell>
			<Table.Cell collapsing>{formatCurrency(campaign.spend_total)}</Table.Cell>
			<Table.Cell collapsing>{formatCurrency(Math.floor(campaign.projected_revenue_total))}</Table.Cell>
			<Table.Cell collapsing>{formatCurrency(Math.floor(campaign.actual_total_revenue))}</Table.Cell>
			{isEditable() ? <Table.Cell collapsing>{ <button onClick={openUpdateCampaignModal}>Edit</button>}</Table.Cell>
			: <Table.Cell collapsing> - </Table.Cell>}
			<Table.Cell collapsing><button onClick={() => handleDelete()}>Delete</button></Table.Cell>
		</Table.Row>

		{isModalOpen && (
			<UpdateCampaignModal
				campaign={campaign}
				updateCampaign={updateCampaign}
				closeModal={closeUpdateCampaignModal}
				open
			/>
		)}
	</>
	
)

}

export default CampaignListItem;

{/* <Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="number" value={campaignFormData.spend_email || ''} name="spend_email" onChange={handleChange}/>: `$${campaignFormData.spend_email}`}</Table.Cell>
<Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="number" value={campaignFormData.spend_facebook || ''} name="spend_facebook" onChange={handleChange}/>: campaignFormData.spend_facebook}</Table.Cell>
<Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="number" value={campaignFormData.spend_google_ads || ''} name="spend_google_ads" onChange={handleChange}/>: campaignFormData.spend_google_ads}</Table.Cell>
<Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="number" value={campaignFormData.spend_instagram || ''} name="spend_instagram" onChange={handleChange}/>: campaignFormData.spend_instagram}</Table.Cell>
<Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="number" value={campaignFormData.spend_website || ''} name="spend_website" onChange={handleChange}/>: campaignFormData.spend_website}</Table.Cell>
<Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="number" value={campaignFormData.spend_youtube || ''} name="spend_youtube" onChange={handleChange}/>: campaignFormData.spend_youtube}</Table.Cell> */}

{/* <Table.Row key={campaign.id} className={editing ? "edit-mode": ""}>
		<Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="text" value={campaignFormData.name || ''} name="name" onChange={handleChange}/>: campaignFormData.name}</Table.Cell>
		<Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="date" value={campaignFormData.start_date || ''} name="start_date" onChange={handleChange}/>: campaignFormData.start_date}</Table.Cell>
		<Table.Cell collapsing>{editing ? <input className="campaign-list-item-input" type="number" value={campaignFormData.duration || ''} name="duration" onChange={handleChange}/>: campaignFormData.duration}</Table.Cell>
		<Table.Cell collapsing>{editing ? <select
			className="campaign-list-item-select"
			name="customer_segment"
			value={campaignFormData.customer_segment || ''}
			onChange={handleSelectChange}
		>
			{customerSegments.map(segment => (
			<option key={segment} value={segment}>
				{segment}
			</option>
			))}
		</select>: campaignFormData.customer_segment}</Table.Cell>
		<Table.Cell collapsing>{editing ? <select
			className="campaign-list-item-select"
			name="target_audience"
			value={campaignFormData.target_audience || ''}
			onChange={handleSelectChange}
		>
			{targetAudiences.map(audience => (
			<option key={audience} value={audience}>
				{audience}
			</option>
			))}
		</select>: campaignFormData.target_audience}</Table.Cell>
		<Table.Cell collapsing>{ `$${campaignFormData.spend_email}`}</Table.Cell>
		<Table.Cell collapsing>{ `$${campaignFormData.spend_facebook}`}</Table.Cell>
		<Table.Cell collapsing>{ `$${campaignFormData.spend_google_ads}`}</Table.Cell>
		<Table.Cell collapsing>{ `$${campaignFormData.spend_instagram}`}</Table.Cell>
		<Table.Cell collapsing>{ `$${campaignFormData.spend_website}`}</Table.Cell>
		<Table.Cell collapsing>{ `$${campaignFormData.spend_youtube}`}</Table.Cell>
		<Table.Cell collapsing>${campaign.spend_total}</Table.Cell>
		<Table.Cell collapsing>${Math.floor(campaign.projected_revenue_total)}</Table.Cell>
		<Table.Cell collapsing>${Math.floor(campaign.actual_total_revenue)}</Table.Cell>
		<Table.Cell collapsing>{ <button onClick={() => setEditing(true)}>Edit</button>}</Table.Cell>
		<Table.Cell collapsing><button onClick={() => handleDelete()}>Delete</button></Table.Cell>


	</Table.Row> */}