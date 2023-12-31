import React, { useState } from 'react';
import { CampaignType } from '../../types/types';
import { Dropdown, DropdownProps } from 'semantic-ui-react';

type CampaignListFilterProps = {
    campaigns: CampaignType[];
    setCampaigns: (filteredCampaigns: CampaignType[]) => void;
};

const CampaignListFilter: React.FC<CampaignListFilterProps> = ({ campaigns, setCampaigns }) => {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    const campaignDateRange = (campaigns: CampaignType[]): any[] => {
        const dateRange = campaigns.map(campaign => campaign.start_date.split('T')[0].slice(0, 7));
        const uniqueDates = Array.from(new Set(dateRange));
        return uniqueDates.map(date => ({
            key: date,
            text: date,
            value: date
        }));
    };

    const handleDateChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const selectedValues = data.value as string[];
        setSelectedDates(selectedValues);
        const filteredCampaigns = campaigns.filter(campaign => 
            selectedValues.includes(campaign.start_date.split('T')[0].slice(0, 7))
        );
        setCampaigns(filteredCampaigns);
    };

    return (
        <div className="CampaignListFilter">
            <Dropdown
                placeholder='Start Month'
                fluid
                multiple
                search
                selection
                options={campaignDateRange(campaigns)}
                onChange={handleDateChange}
                value={selectedDates}
            />
        </div>
    );
}

export default CampaignListFilter;
