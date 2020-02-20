import { Application, ApplicationStatus, Address, Beneficiary } from '@insuqo/shared';
import { ApiBaseService, RequestConfig } from './api-base.service';
import { Logger } from './logger';

export class ApplicationService extends ApiBaseService {
    public async getStatus(sk: string): Promise<ApplicationStatus | undefined> {
        const statusResponse = await this.get<{ status: ApplicationStatus }>('/applications/status?id=' + encodeURIComponent(sk));
        return statusResponse.data && statusResponse.data.status;
    }

    public async createApplication(quoteId: string, quoteRecId: number, birthDate: string, address: Partial<Address>): Promise<Application | undefined> {
        return (await this.authenticatedPut<Application>('/applications/new', { quoteId, quoteRecId, address, birthDate })).data;
    }

    public async getApplication(id: string): Promise<Application | undefined> {
        const applicationRes = await this.authenticatedGet<Application>(`/applications/${id}`);
        return applicationRes.data;
    }

    public async getBeneficiaries(applicationId: string): Promise<Beneficiary[]> {
        const benRes = await this.authenticatedGet<Beneficiary[]>(`/applications/${applicationId}/beneficiaries`);
        return benRes.data || [];
    }

    public async getImageUrl(appId: string, imageKey: string): Promise<string | undefined> {
        return (await this.authenticatedGet<string>(`/applications/${appId}/image-url/${imageKey}`)).data;
    }

    public async updateBasicInfo(applicationId: string, application: Application): Promise<Application | undefined> {
        return (await this.authenticatedPut<Application>(`/applications/${applicationId}/basic-info`, application)).data;
    }

    public async updatePaymentInfo(applicationId: string, paymentInfo: any): Promise<Application | undefined> {
        return (await this.authenticatedPut<Application>(`/applications/${applicationId}/payment-info`, paymentInfo)).data;
    }

    public async updateApplication(applicationId: string, application: Partial<Application>): Promise<Application | undefined> {
        Logger.log(application);
        const res = await this.authenticatedPut<Application>(`/applications/${applicationId}/update`, application);
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
}

interface SignedUrlResponse {
    put: string;
    delete: string;
    id: string;
}
