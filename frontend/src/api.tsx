import axios, { AxiosResponse, Method } from "axios";

const BASE_URL = "http://127.0.0.1:5000/api"

interface ApiResponse {
  data: any; // Define a more specific type if possible
}

class UserApi {
  // Add types for your methods

  static async request(endpoint: string, data: object = {}, method: Method = "get"): Promise<ApiResponse> {
    const url = `${BASE_URL}/${endpoint}`;
    const params = method === "get" ? data : {};
    try {
      const response: AxiosResponse = await axios({ url, method, data, params });
      return response;
    } catch (err: any) {
      console.error("API Error:", err.response);
      let message = err.response.data.msg;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getCurrentUser(user_id: string): Promise<ApiResponse> {
    return this.request(`users/${user_id}`);
  }

  static async register(data: object): Promise<string> {
    const res = await this.request("users/signup", data, "post");
    return res.data.access_token;
  }

  static async login(data: object): Promise<string> {
    const res = await this.request("users/login", data, "post");
    return res.data.access_token;
  }

  static async addCampaign(data: object): Promise<ApiResponse> {
    return this.request("campaigns", data, "post");
  }

  static async updateCampaign(campaignId: number, data: object): Promise<ApiResponse> {
    return this.request(`campaigns/${campaignId}`, data, "patch");
  }

  static async deleteCampaign(campaignId: number): Promise<ApiResponse> {
    return this.request(`campaigns/${campaignId}`, {}, "delete");
  }

  static async getCampaign(campaignId: number): Promise<any> {
    const res = await this.request(`campaigns/${campaignId}`);
    console.log(res.data);
    return res.data;
  }

}

export default UserApi;
