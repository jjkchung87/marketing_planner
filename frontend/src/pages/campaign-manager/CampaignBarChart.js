import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import transformDataForBarChart from '../../utils/transformDataForBarChart';

const CampaignBarChart = ({ campaign={} }) => {
  const transformedData = transformDataForBarChart(campaign);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={transformedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Use the correct dataKey properties for Bar elements */}
        <Bar dataKey="spend" fill="#8884d8" />
        <Bar dataKey="projectedRevenue" fill="#82ca9d" />
        <Bar dataKey="actualRevenue" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CampaignBarChart;
