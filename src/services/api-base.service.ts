import axios from 'axios';
import { AuthenticationService } from './authentication.service';
import { ApiResponse } from 'insuqo-shared/types/api-response';

const apiUrl = process.env.REACT_APP_API_URL;

export class ApiBaseService {
    protected async authenticatedGet<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return (await axios.get<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), {
            headers: {
                Authorization: await ApiBaseService.getAuthHeader(),
                ...config?.headers
            }
        })).data;
    }

    protected async authenticatedPut<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return (await axios.put<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), body, {
            headers: {
                Authorization: await ApiBaseService.getAuthHeader(),
            }
        })).data;
    }

    protected async get<T>(endpoint: string, queryParams?: any): Promise<ApiResponse<T>> {
        return (await axios.get<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), {
            params: queryParams
        })).data;
    }

    private static async getAuthHeader(): Promise<string> {
        return `Bearer ${await AuthenticationService.getAccessToken()}`;
    }

    private static buildURL(endpoint: string): string {
        return apiUrl + endpoint;
    }
}

export interface RequestConfig {
    headers?: { [key: string]: string };
}
