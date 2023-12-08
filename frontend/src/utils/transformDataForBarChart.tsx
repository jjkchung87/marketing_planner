import { CampaignType} from '../types/types';

type MediaType = {
  name: string;
  key: string;
};

type TransformedSet = {
  name: string;
  spend: number;
  projectedRevenue: number;
  actualRevenue: number;
};

function transformDataForBarChart(originalData: CampaignType | null): TransformedSet[] {
    
    if(!originalData) return ([]);
  
    const mediaTypes: MediaType[] = [
      { name: "Email", key: "email" },
      { name: "Facebook", key: "facebook" },
      { name: "Google Ads", key: "google_ads" },
      { name: "Instagram", key: "instagram" },
      { name: "Website", key: "website" },
      { name: "YouTube", key: "youtube" },
      { name: "Total", key: "total" },
    ];
  
    const transformedData: TransformedSet[] = [];
  
    for (const mediaType of mediaTypes) {
      const spendValue = originalData[`spend_${mediaType.key}` as keyof CampaignType];
      const projectedRevenueValue = originalData[`projected_revenue_${mediaType.key}` as keyof CampaignType];
      const actualRevenueValue = originalData[`actual_revenue_${mediaType.key}` as keyof CampaignType];
      
      const set: TransformedSet = {
        name: mediaType.name,
        spend: typeof spendValue === 'number' ? spendValue : 0,
        projectedRevenue: typeof projectedRevenueValue === 'number' ? projectedRevenueValue : 0,
        actualRevenue: typeof actualRevenueValue === 'number' ? actualRevenueValue : 0   
      };
  
      transformedData.push(set);
    }
  
    return transformedData;
}

export default transformDataForBarChart;
