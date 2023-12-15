import axios, { AxiosResponse, Method, AxiosError } from "axios";
import {CampaignFormData, CampaignType, CurrentUserType} from "./types/types";

const BASE_URL = "http://127.0.0.1:5000/api"

interface ApiResponse<T> {
  data: T;
}
class MarketingPlannerApi {
  // Add types for your methods

  static async request<T>(endpoint: string, data: object = {}, method: "get" | "post" | "patch" | "delete" = "get"): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}/${endpoint}`;
    const params = method === "get" ? data : {};
    try {
      const response: AxiosResponse<T> = await axios({ url, method, data, params });
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      console.error("API Error:", error.response);
      let message = error.response?.data.msg || "An error occurred";
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getCurrentUser(user_id: string): Promise<CurrentUserType> {
    return this.request<UserType>(`users/${user_id}`);
  }

  static async register(data: object): Promise<string> {
    const res = await this.request("users/register", data, "post");
    return res.data.access_token;
  }

  static async signup(data: object): Promise<string> {
    const res = await this.request("users/signup", data, "post");
    return res.data.access_token;
  }

  static async addCampaign(data: object): Promise<ApiResponse> {
    return this.request("campaigns", data, "post");
  }

  static async updateCampaign(campaignId: number, data: CampaignFormData ): Promise<CampaignType> {
    const res = await this.request(`campaigns/${campaignId}`, data, "patch");
    return res.data;
  }

  static async deleteCampaign(campaignId: number): Promise<ApiResponse> {
    return this.request(`campaigns/${campaignId}`, {}, "delete");
  }

  static async getCampaign(campaignId: number): Promise<any> {
    const res = await this.request(`campaigns/${campaignId}`);
    console.log(res.data);
    return res.data;
  }

  static async getCampaigns(): Promise<any> {
    const res = await this.request("campaigns");
    return res.data;
  }

}

export default UserApi;
