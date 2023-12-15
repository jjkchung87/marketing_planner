// Define the type for the campaign object
export type CampaignType = {
    id: number;
    name: string;
    start_date: string;
    duration: number;
    status: string;
    target_audience_id: number; 
    target_audience: string;
    customer_segment_id: number;
    customer_segment: string;
    spend_email: number;
    spend_facebook: number;
    spend_google_ads: number;
    spend_instagram: number;
    spend_website: number;
    spend_youtube: number;
    spend_total: number;
    projected_revenue_email: number; 
    projected_revenue_facebook: number;
    projected_revenue_google_ads: number;
    projected_revenue_instagram: number; 
    projected_revenue_website: number;
    projected_revenue_youtube: number; 
    projected_revenue_total: number;
    actual_revenue_email: number;    
    actual_revenue_facebook: number;
    actual_revenue_google_ads: number; 
    actual_revenue_instagram: number; 
    actual_revenue_website: number;  
    actual_revenue_youtube: number;
    actual_total_revenue: number;
    impressions: number;
    clicks: number;
  };

  // Define type for campaign form data

  export type CampaignFormData = {
    name: string | null;
    start_date: string | null;
    duration: number | null;
    customer_segment: string | null;
    target_audience: string | null;
    spend_email: number | null;
    spend_facebook: number | null;
    spend_google_ads: number | null;
    spend_instagram: number | null;
    spend_website: number | null;
    spend_youtube: number | null;
  };
    
  // Define type for signup form data

  export type SignupFormDataType = {
    firstName: string | null;
    lastName: string | null;
    password: string | null;
    email: string | null;
    role: string | null;
  };

  // Define type for login form data

  export type LoginFormDataType = {
    password: string | null;
    email: string | null;
  };

  // Define type for current user

  export type CurrentUserType = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  } | null;
  

  // Define UserContextType

  export type UserContextType = {
    currentUser: CurrentUserType;
    setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUserType>>;
  };
  
  