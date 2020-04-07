import axios from 'axios';
import { ApiResponse } from '@insuqo/shared/types/api-response';
import { Auth } from '../services/firebase';

const apiUrl = process.env.REACT_APP_API_URL;

export class ApiBaseService {
    protected async authenticatedGet<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return (await axios.get<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), {
            headers: {
                Authorization: 'Bearer ' + await ApiBaseService.getAuthHeader(),
                ...config?.headers
            }
        })).data;
    }

    protected async authenticatedPut<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return (await axios.put<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), body, {
            headers: {
                Authorization: 'Bearer ' + await ApiBaseService.getAuthHeader(),
            }
        })).data;
    }

    protected async get<T>(endpoint: string, queryParams?: any): Promise<ApiResponse<T>> {
        return (await axios.get<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), {
            params: queryParams
        })).data;
    }

    protected async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>>;
    protected async post<B extends object, T = any>(endpoint: string, body?: B): Promise<ApiResponse<T>>;
    protected async post<B extends object, T = any>(endpoint: string, body?: B): Promise<ApiResponse<T>> {
        return (await axios.post<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), body)).data;
    }

    protected async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>>;
    protected async put<B = any, T = any>(endpoint: string, body?: B): Promise<ApiResponse<T>>;
    protected async put<B = any, T = any>(endpoint: string, body?: B): Promise<ApiResponse<T>> {
        return (await axios.put<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), body)).data;
    }

    private static async getAuthHeader(): Promise<string> {
        return new Promise((resolve, reject) => {
            Auth.onAuthStateChanged((user) => {
                if (user) {
                    resolve(user.getIdToken());
                } else {
                    reject('No user is logged in');
                }
            });
        });
    }

    private static buildURL(endpoint: string): string {
        return apiUrl + endpoint;
    }
}

export interface RequestConfig {
    headers?: { [key: string]: string };
}
