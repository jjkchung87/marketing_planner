import React, {useContext} from 'react'
import { Icon, Menu, Table, Grid} from 'semantic-ui-react'
import CampaignsContext from '../../context/CampaignsContext'
import CampaignListItem from './CampaignListItem'

const CampaignListTable = () => {

    const { filteredCampaigns, updateCampaign, deleteCampaign } = useContext(CampaignsContext);
    const tableHeaders = ['Campaign Name', 'Start Date', 'Duration', 'Customer Segment', 'Target Audience', 'Email Spend', 'Facebook Spend', 'Google Spend', 'Instagram Spend', 'Website Spend', 'Youtube Spend', 'Total Spend', 'Projected Revenue', 'Actual Revenue', 'Edit', 'Delete'];
    
    return (
        <div className="scrollable-table-container">
            <Table  sortable compact >
                <Table.Header className="fixed-header" >
                    <Table.Row>
                    {tableHeaders.map((header) => (
                        <Table.HeaderCell >{header}</Table.HeaderCell>
                    ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body className="scrollable-body">
                    {filteredCampaigns && filteredCampaigns.map((campaign) => (
                    <CampaignListItem campaign={campaign} key={campaign.id}/>
                    ))}
                </Table.Body>
            </Table>
        </div>
    )
}

export default CampaignListTable;