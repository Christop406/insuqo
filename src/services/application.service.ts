import { Application, ApplicationStatus, Beneficiary, QuickTermQuoteResult, Quote } from '@insuqo/shared';
import { ApiBaseService, RequestConfig } from './api-base.service';
import { ZipCode } from '@insuqo/shared/types/zip-code';

export class ApplicationService extends ApiBaseService {
    public async getStatus(sk: string): Promise<ApplicationStatus | undefined> {
        const statusResponse = await this.get<{ status: ApplicationStatus }>('/applications/status?id=' + encodeURIComponent(sk));
        return statusResponse.data && statusResponse.data.status;
    }

    public async createApplication(quoteKey: Pick<QuickTermQuoteResult, 'id' | 'RecID'>): Promise<Application | undefined> {
        return (await this.authenticatedPut<typeof quoteKey, Application>('/applications/new', quoteKey)).data;
    }

    public async getApplication(id: string): Promise<{ application: Application; quote?: Quote; location?: ZipCode } | undefined> {
        const applicationRes = await this.authenticatedGet<any>(`/applications/${id}`);
        return applicationRes.data;
    }

    public async getBeneficiaries(applicationId: string): Promise<Beneficiary[]> {
        const benRes = await this.authenticatedGet<Beneficiary[]>(`/applications/${applicationId}/beneficiaries`);
        return benRes.data || [];
    }

    public async updateApplication(applicationId: string, application: Partial<Application>): Promise<Application | undefined> {
        const res = await this.authenticatedPut<Application>(`/applications/${applicationId}`, application);
        return res.data;
    }

    public async submitApplication(applicationId: string): Promise<Application | undefined> {
        return (await this.authenticatedPut<Application>(`/applications/${applicationId}/submit`)).data;
    }

    public async getSignedUploadUrl(applicationId: string, config?: RequestConfig): Promise<SignedUrlResponse | undefined> {
        const res = await this.authenticatedGet<SignedUrlResponse>(`/applications/${applicationId}/payment/sign-url`, config);
        if (res.success) {
            return res.data;
        } else {
            throw new Error(res.error);
        }
    }

    public async getSignedImageUrl(appId: string, imageKey: string): Promise<string | undefined> {
        const r = await this.authenticatedGet<string>(`/applications/${appId}/image-url/${imageKey}`);
        return r.data;
    }

    public async getImage(appId: string, imageKey: string): Promise<Blob> {
        return (await this.authenticatedGet<Blob, false>(`/applications/${appId}/image/${imageKey}`));
    }

    public async deleteImage(applicationId: string, fileName: string): Promise<void> {
        return this.authenticatedDelete(['applications', applicationId, 'image', fileName]);
    }

    public async uploadFile(applicationId: string, file: Blob, fileName: string): Promise<string | undefined> {
        const formData = new FormData();
        formData.append('file', file);

        const res = await this.authenticatedPost<string>(`/applications/${applicationId}/upload?named=${fileName || ''}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return res.data;
    }
}

export interface SignedUrlResponse {
    put: string;
    delete: string;
    id: string;
}
