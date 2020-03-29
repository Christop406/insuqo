import { ApiBaseService } from './api-base.service';
import { Beneficiary } from '../model/beneficiary';

export class BeneficiaryService extends ApiBaseService {
    public async getBeneficiaries(applicationId: string): Promise<Beneficiary[]> {
        const benResponse = await this.authenticatedGet<Beneficiary[]>(`/beneficiaries/application/${applicationId}`);
        return benResponse.data || [];
    }

    public async updateBeneficiaries(applicationId: string, beneficiaries: Beneficiary[]): Promise<Beneficiary[]> {
        const benResponse = await this.authenticatedPut<Beneficiary[]>(`/beneficiaries/application/${applicationId}`, {
            beneficiaries,
        });
        return benResponse.data || [];
    }
}