import React from 'react';
import  { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CampaignType } from '../../types/types';
import "./CampaignList.css";

type MonthlyChartProps = {
    campaigns: CampaignType[];
};

const MonthlyChart: React.FC<MonthlyChartProps> = ({ campaigns }) => {

    function generateMonthlySummary(campaigns: CampaignType[]) {
        let monthlyData: any = {};
        
        campaigns.forEach(campaign => {
            let startDate = new Date(campaign.start_date);
            let durationInDays = campaign.duration;
            let endDate = new Date(startDate.getTime() + (durationInDays * 24 * 60 * 60 * 1000));

            if (durationInDays === 0) {
            console.warn(`Campaign ${campaign.name} has a duration of zero days, skipping.`);
            return; // Skip this campaign to prevent division by zero
            }
        
            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            // Get the month and year in the format "YY-MMMM". Including leading '0' for single digit months.
            let yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
            if (!monthlyData[yearMonth]) {
                monthlyData[yearMonth] = {
                spend: 0,
                projected_revenue: 0,
                actual_revenue: 0,
                topProjectedCampaigns: [],
                topActualCampaigns: []
                };
            }
        
            monthlyData[yearMonth].spend += campaign.spend_total / durationInDays;
            monthlyData[yearMonth].projected_revenue += campaign.projected_revenue_total / durationInDays;
            monthlyData[yearMonth].actual_revenue += campaign.actual_total_revenue / durationInDays;
        
            // Push the campaign into the top campaigns list for later sorting
            // monthlyData[yearMonth].topProjectedCampaigns.push({
            //   name: campaign.name,
            //   value: campaign.projected_revenue_total
            // });
        
            // monthlyData[yearMonth].topActualCampaigns.push({
            //   name: campaign.name,
            //   value: campaign.actual_total_revenue
            // });
            }
        });
        
        // Convert to array and sort the top campaigns.
        let graphDataArray = Object.keys(monthlyData).map(yearMonth => {
            let data = monthlyData[yearMonth];
            data.topProjectedCampaigns.sort((a:any, b:any) => b.value - a.value).slice(0, 5); // Sort descending and take top 5
            data.topActualCampaigns.sort((a:any, b:any) => b.value - a.value).slice(0, 5); // Sort descending and take top 5
            data.spend = `$ ${Math.round(data.spend)}`;
            data.projected_revenue = `$ ${Math.round(data.projected_revenue)}`;
            data.actual_revenue = `$ ${Math.round(data.actual_revenue)}`;

            return {
            month: yearMonth,
            ...data
            };  
        });

        // Sort graphDataArray by yearMonth in ascending order
        graphDataArray.sort((a:any, b:any) => {
            if (a.month < b.month) return -1;
            if (a.month > b.month) return 1;
            return 0;
        }
        );

        return graphDataArray;

    }
      
      
    const data = generateMonthlySummary(campaigns);

    const filteredData = data.filter((item:any) => {
        return item.month.includes("2023");    });

    console.log(filteredData);
      
               

        return (
            <div className="monthly-chart">
                    <BarChart
                        width={1300}
                        height={500}
                        data={filteredData}
                        margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                        }}
                        barSize={5}
                    >
                        <XAxis dataKey="month" scale="point" padding={{ left: 10, right: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="spend" fill="#FFA500" />
                        <Bar dataKey="projected_revenue" fill="#8884d8"/>
                        <Bar dataKey="actual_revenue" fill="#82ca9d"/>
                    </BarChart>
            </div>
        )
    }

export default MonthlyChart;
