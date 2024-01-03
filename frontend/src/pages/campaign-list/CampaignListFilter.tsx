import React, { useState, useContext } from 'react';
import { CampaignType } from '../../types/types';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import CampaignsContext from '../../context/CampaignsContext';
import "./CampaignListFilter.css";    

type FiltersState = {
    start_date: string[];
    duration: number[];
    customer_segment: string[];
    target_audience: string[];
  };

// Define the shape of your filters state more precisely
const CampaignListFilter: React.FC = () => {
    const { campaigns, filterCampaigns } = useContext(CampaignsContext);
    const [filters, setFilters] = useState<FiltersState>({
      start_date: [],
      duration: [],
      customer_segment: [],
      target_audience: [],
    });
  
    // Use keyof FiltersState to ensure filterFields match the keys of filters
    const filterFields: (keyof FiltersState)[] = ['start_date', 'duration', 'customer_segment', 'target_audience'];
  
    type OptionType = {
      key: string | number;
      text: string;
      value: string | number;
    };
      
    const filterFieldOptions = <K extends keyof CampaignType>(campaigns: CampaignType[], field: K): OptionType[] => {        
        if (field === 'start_date') {
          const dateValues = campaigns.map(campaign => new Date(campaign[field] as string));
          const minDate = new Date(Math.min(...dateValues.map(date => date.getTime())));
          const maxDate = new Date(Math.max(...dateValues.map(date => date.getTime())));
          
          const dateOptions: OptionType[] = [];
          for (let d = minDate; d <= maxDate; d.setDate(d.getDate() + 1)) {
            dateOptions.push({
              key: d.toISOString().substring(0, 10),
              text: d.toLocaleDateString(),
              value: d.toISOString().substring(0, 10)
            });
          }
          return dateOptions;
          
        } else if (field === 'duration') {
          // Assume duration is already an array of numbers
          const uniqueDurations = Array.from(new Set(campaigns.map(campaign => campaign[field] as number))).sort((a, b) => a - b);
          return uniqueDurations.map(duration => ({
            key: duration,
            text: `${duration} days`,
            value: duration
          }));
          
        } else {
          // For other fields like segments and audiences
          const fieldValues = campaigns.map(campaign => campaign[field]);
          const uniqueValues = Array.from(new Set(fieldValues));
          return uniqueValues.map(value => ({
            key: value,
            text: value as string,
            value: value
          }));
        }
      };
      

    const handleFilterFieldChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const { name, value } = data;
    if (typeof name === 'string' && name in filters) {
        setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
        }));
        // Trigger filtering logic
        filterCampaigns({ ...filters, [name]: value as any });
    }
    };

    return (
        <div className="CampaignListFilter">
          <div className="filter-header">Filters</div>
          {filterFields.map(field => (
            <div className="dropdown-container" key={field}>
              <Dropdown
                placeholder={field}
                fluid
                multiple
                search
                selection
                options={filterFieldOptions(campaigns, field as keyof CampaignType)} // Cast to keyof CampaignType
                onChange={handleFilterFieldChange}
                name={field}
                value={filters[field]}
              />
            </div>
          ))}
        </div>
      );
    };

    export default CampaignListFilter;