import axios, { AxiosResponse, AxiosError } from "axios";
import { CampaignFormData, CampaignType, CurrentUserType, ChatResponseType } from "./types/types";

const BASE_URL = "http://127.0.0.1:5000/api";


interface ApiErrorResponse {
  message: string | string[];
  name: string;
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      message?: string;
    };
  };
}


class MarketingPlannerApi {

  static token: string | null = null;

  static async request<T>(endpoint: string, data: object = {}, method: "get" | "post" | "patch" | "delete" = "get"): Promise<T> {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MarketingPlannerApi.token}` };
    const params = method === "get" ? data : {};

    try {
      const response: AxiosResponse<T> = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>; // Assert that err is an AxiosError
      let message: string | string[] = "An error occurred";
  
      if (axiosError.response && axiosError.response.data) {
        message = axiosError.response.data.message || "An error occurred";
      } else if (axiosError.message) {
        message = axiosError.message;
      }
  
      console.error("API Error:", message);
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getCurrentUser(user_id: number): Promise<CurrentUserType> {
    return this.request<CurrentUserType>(`users/${user_id}`);
  }

  static async authenticate(data: object): Promise<string> {
    const res = await this.request<{ access_token: string }>("users/authenticate", data, "post");
    return res.access_token;
  }

  static async signup(data: object): Promise<string> {
    const res = await this.request<{ access_token: string }>("users/signup", data, "post");
    return res.access_token;
  }

  static async addCampaign(data: CampaignFormData): Promise<CampaignType> {
    return this.request<CampaignType>("campaigns", data, "post");
  }

  static async updateCampaign(campaignId: number, data: CampaignFormData): Promise<CampaignType> {
    return this.request<CampaignType>(`campaigns/${campaignId}`, data, "patch");
  }

  static async deleteCampaign(campaignId: number): Promise<void> {
    await this.request<void>(`campaigns/${campaignId}`, {}, "delete");
  }

  static async getCampaign(campaignId: number): Promise<CampaignType> {
    return this.request<CampaignType>(`campaigns/${campaignId}`);
  }

  static async getCampaigns(): Promise<CampaignType[]> {
    // Assuming the response is an object with a 'campaigns' key
    const res = await this.request<{ campaigns: CampaignType[] }>("campaigns");
    return res.campaigns;
  }

  static async chatbot(data: object): Promise<ChatResponseType> {
    const res = await this.request<ChatResponseType>("chatbot", data, "post");
    return res ;
  }
} 

export default MarketingPlannerApi;
