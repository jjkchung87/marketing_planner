import React, {useContext} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CampaignType } from '../../types/types';
import "./CampaignList.css";
import CampaignsContext from '../../context/CampaignsContext';


const MonthlyChart: React.FC = () => {

    const { filteredCampaigns } = useContext(CampaignsContext);

    function generateMonthlySummary(campaigns: CampaignType[]) {
        let monthlyData: any = {};

        campaigns.forEach(campaign => {
            let startDate = new Date(campaign.start_date);
            let durationInDays = campaign.duration;
            let endDate = new Date(startDate.getTime() + (durationInDays * 24 * 60 * 60 * 1000));

            if (durationInDays === 0) {
                console.warn(`Campaign ${campaign.name} has a duration of zero days, skipping.`);
                return;
            }

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                let yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                if (!monthlyData[yearMonth]) {
                    monthlyData[yearMonth] = {
                        spend: 0,
                        projected_revenue: 0,
                        actual_revenue: 0,
                    };
                }

                monthlyData[yearMonth].spend += Math.round(campaign.spend_total / durationInDays / 100) * 100;
                monthlyData[yearMonth].projected_revenue += Math.round(campaign.projected_revenue_total / durationInDays / 100) * 100;
                monthlyData[yearMonth].actual_revenue += Math.round(campaign.actual_total_revenue / durationInDays / 100) * 100;
                

            }
        });

        let graphDataArray = Object.keys(monthlyData).map(yearMonth => {
            return {
                month: yearMonth,
                ...monthlyData[yearMonth],
            };
        });

        graphDataArray.sort((a, b) => a.month.localeCompare(b.month));

        return graphDataArray;
    }

    const data = generateMonthlySummary(filteredCampaigns);


    return (
        <div className="monthly-chart">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="spend" fill="#FFA500" />
                    <Bar dataKey="projected_revenue" fill="#8884d8" />
                    <Bar dataKey="actual_revenue" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MonthlyChart;

