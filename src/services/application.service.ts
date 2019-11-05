import {ApplicationStatus} from 'insuqo-shared';
import {ApiBaseService} from './api-base.service';

export class ApplicationService extends ApiBaseService {
    public async getStatus(sk: string): Promise<ApplicationStatus | undefined> {
        const statusResponse = await this.get<{status: ApplicationStatus}>('/applications/status?id=' + encodeURIComponent(sk));
        return statusResponse.data && statusResponse.data.status;
    }
}
