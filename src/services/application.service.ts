import { Application, ApplicationStatus } from 'insuqo-shared';
import { ApiBaseService, RequestConfig } from './api-base.service';

export class ApplicationService extends ApiBaseService {
    public async getStatus(sk: string): Promise<ApplicationStatus | undefined> {
        const statusResponse = await this.get<{ status: ApplicationStatus }>('/applications/status?id=' + encodeURIComponent(sk));
        return statusResponse.data && statusResponse.data.status;
    }

    public async getApplication(id: string): Promise<Application | undefined> {
        const applicationRes = await this.authenticatedGet<Application>('/applications?id=' + encodeURIComponent(id));
        return applicationRes.data;
    }

    public async submitApplication(application: any): Promise<Application | undefined> {
        throw new Error('Not Implemented.');
    }

    public async getSignedUploadUrl(applicationId: string, config?: RequestConfig): Promise<SignedUrlResponse | undefined> {
        const res = await this.authenticatedGet<SignedUrlResponse>(`/applications/${applicationId}/payment/sign-url`, config);
        if (res.success) {
            return res.data;
        } else {
            throw new Error(res.error);
        }
    }
}

interface SignedUrlResponse {
    put: string;
    delete: string;
    id: string;
}
