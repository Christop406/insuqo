import { ApiBaseService } from './api-base.service';
import { DynamoQuote, QuoteInsertResponse } from '../model/dynamo-quote';
import { ApiResponse } from '@insuqo/shared/types/api-response';
import { QuickTermQuoteResult } from '@insuqo/shared';

export class QuoteService extends ApiBaseService {

    public async getQuotesByKey(key: string): Promise<DynamoQuote[] | undefined> {
        return (await this.get<DynamoQuote[]>(`/quotes/${encodeURIComponent(key)}`)).data;
    }

    public async getQuotesForApplication(applicationId: string): Promise<QuickTermQuoteResult[]> {
        const quoteRes = await this.authenticatedGet<QuickTermQuoteResult[]>(`/quotes/application/${applicationId}`);
        return quoteRes.data || [];
    }

    public runQuotes = (
        state: string | undefined,
        actualAge: number | undefined,
        nearestAge: number | undefined,
        amount: number | undefined,
        termLength: number | undefined,
        healthType: any,
        sex: string | undefined,
        rider: string | undefined,
        showTop: number
    ): Promise<ApiResponse<QuoteInsertResponse>> => {

        const requiredParams = [state, actualAge, nearestAge, amount, termLength, healthType, sex, rider, showTop];

        if (requiredParams.some(el => el === undefined)) {
            return Promise.reject('undefined_data');
        }

        return this.get('/quotes/run', {
            state: state,
            actualAge: actualAge,
            nearestAge: nearestAge,
            amount: amount,
            length: termLength,
            // health: healthType,
            sex: sex,
            rider: rider,
            top: showTop,
            paymentFreq: 'Monthly',
            smoker: 'false'
        });
    }
}
