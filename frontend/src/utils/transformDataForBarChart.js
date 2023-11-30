//Transforms campaign data object to work for Bar Chart

function transformDataForBarChart(originalData) {
    // Define an array of media types and their corresponding keys

    console.log(originalData)

    const mediaTypes = [
      { name: "Email", key: "email" },
      { name: "Facebook", key: "facebook" },
      { name: "Google Ads", key: "google_ads" },
      { name: "Instagram", key: "instagram" },
      { name: "Website", key: "website" },
      { name: "YouTube", key: "youtube" },
      { name: "Total", key: "total" },
    ];
  
    // Initialize an empty array to store the transformed data
    const transformedData = [];
  
    // Loop through each media type and extract spend, projected revenue, and actual revenue
    for (const mediaType of mediaTypes) {
      const set = {
        name: mediaType.name,
        spend: originalData[`spend_${mediaType.key}`] || 0,
        projectedRevenue: originalData[`projected_revenue_${mediaType.key}`] || 0,
        actualRevenue: originalData[`actual_revenue_${mediaType.key}`] || 0,
      };
  
      console.log('transformed Data: ', transformedData)
      // Push the set of bars for the current media type to the transformed data array
      transformedData.push(set);
    }
  
    return transformedData;
  }

  

export default transformDataForBarChart