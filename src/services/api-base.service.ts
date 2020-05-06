import axios from 'axios';
import { ApiResponse } from '@insuqo/shared/types/api-response';
import { Auth } from '../services/firebase';

const apiUrl = process.env.REACT_APP_API_URL;

declare type Path = string | string[];

export class ApiBaseService {
    protected async authenticatedGet<T>(endpoint: Path, config?: RequestConfig): Promise<ApiResponse<T>>;
    protected async authenticatedGet<T, F extends false>(endpoint: Path, config?: RequestConfig): Promise<T>;
    protected async authenticatedGet<T, F>(endpoint: Path, config?: RequestConfig): Promise<ApiResponse<T>> {
        return (await axios.get<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), {
            headers: {
                Authorization: 'Bearer ' + await ApiBaseService.getAuthHeader(),
                ...config?.headers
            }
        })).data;
    }

    protected async authenticatedPut<T>(endpoint: Path, body?: any): Promise<ApiResponse<T>>;
    protected async authenticatedPut<B extends object, T>(endpoint: Path, body?: B): Promise<ApiResponse<T>>;
    protected async authenticatedPut<B extends object, T, F extends false>(endpoint: Path, body?: B): Promise<T>;
    protected async authenticatedPut<B extends object, T>(endpoint: Path, body?: B): Promise<ApiResponse<T | undefined>> {
        return (await axios.put<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), body, {
            headers: {
                Authorization: 'Bearer ' + await ApiBaseService.getAuthHeader(),
            }
        })).data;
    }

    protected async authenticatedPost<T>(endpoint: Path, body?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
    protected async authenticatedPost<B extends object, T>(endpoint: Path, body?: B, config?: RequestConfig): Promise<ApiResponse<T>>;
    protected async authenticatedPost<B extends object, T>(endpoint: Path, body?: B, config: RequestConfig = {}): Promise<ApiResponse<T | undefined>> {
        return (await axios.post<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), body, {
            headers: {
                Authorization: 'Bearer ' + await ApiBaseService.getAuthHeader(),
                ...config.headers,
            }
        })).data;
    }

    protected async authenticatedDelete(endpoint: Path, queryParams?: any, config: RequestConfig = {}): Promise<void> {
        return (await axios.delete(ApiBaseService.buildURL(endpoint), {
            params: queryParams,
            headers: {
                Authorization: 'Bearer ' + await ApiBaseService.getAuthHeader(),
                ...config.headers,
            }
        })).data;
    }

    protected async get<T>(endpoint: Path, queryParams?: any): Promise<ApiResponse<T>> {
        return (await axios.get<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), {
            params: queryParams
        })).data;
    }

    protected async post<T = any>(endpoint: Path, body?: any): Promise<ApiResponse<T>>;
    protected async post<B extends object, T = any>(endpoint: Path, body?: B): Promise<ApiResponse<T>>;
    protected async post<B extends object, T = any>(endpoint: Path, body?: B): Promise<ApiResponse<T>> {
        return (await axios.post<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), body)).data;
    }

    protected async put<T = any>(endpoint: Path, body?: any): Promise<ApiResponse<T>>;
    protected async put<B = any, T = any>(endpoint: Path, body?: B): Promise<ApiResponse<T>>;
    protected async put<B = any, T = any>(endpoint: Path, body?: B): Promise<ApiResponse<T>> {
        return (await axios.put<ApiResponse<T>>(ApiBaseService.buildURL(endpoint), body)).data;
    }

    protected static async getAuthHeader(): Promise<string> {
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

    protected static buildURL(endpoint: Path): string {
        if (Array.isArray(endpoint)) {
            endpoint = '/' + endpoint.join('/');
        }
        console.log(apiUrl + endpoint);
        return apiUrl + endpoint;
    }

    protected static joinPaths(...paths: string[]): string {
        return paths.join('/');
    }
}

export interface RequestConfig {
    headers?: { [key: string]: string };
}
