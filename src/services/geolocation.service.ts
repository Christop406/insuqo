import { ZipCode } from '@insuqo/shared/types/zip-code';
import { ApiBaseService } from './api-base.service';

export class GeolocationService extends ApiBaseService {
    public async localizeZip(zip?: string): Promise<ZipCode | undefined> {
        if (zip == null || zip.length < 5) {
            throw new Error('ZIP Code invalid');
        }

        const response = await this.get<ZipCode>('/util/zip/lookup', { zip });

        return response.data;
    }
}