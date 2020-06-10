import { ApiBaseService } from './api-base.service';
import { DynamoQuote, QuoteInsertResponse } from '../model/dynamo-quote';
import { ApiResponse } from '@insuqo/shared/types/api-response';
import { QuickTermQuoteResult, Quote } from '@insuqo/shared';
import { ZipCode } from '@insuqo/shared/types/zip-code';

export class QuoteService extends ApiBaseService {

    public async getQuotesByKey(key: string): Promise<DynamoQuote[] | undefined> {
        console.log(key);
        return [];
    }

    public async getQuoteRecord(id: string): Promise<{ quote: Quote; location: ZipCode } | undefined> {
        return (await this.get<{ quote: Quote; location: ZipCode }>(`/quotes/${id}`)).data;
    }

    public async createQuoteRecord(zip: string): Promise<{ quote: Quote; location: ZipCode } | undefined> {
        if (!zip || zip.length < 5) {
            throw new Error('ZIP Code is invalid. Must be at least 5 characters.');
        }
        return (await this.post<{ quote: Quote; location: ZipCode }>('/quotes/new', { zip })).data;
    }

    public async updateQuoteRecord(id: string, updatedQuote: Partial<Omit<Quote, 'id'>>): Promise<Quote> {
        const updateResponse = await this.put('/quotes/update', {
            id,
            ...updatedQuote,
        });
        return updateResponse.data;
    }

    public async getQuotesForApplication(applicationId: string): Promise<QuickTermQuoteResult[]> {
        const quoteRes = await this.authenticatedGet<QuickTermQuoteResult[]>(`/quotes/application/${applicationId}`);
        return quoteRes.data || [];
    }

    public runQuotes = (
        quoteId: string,
        showTop = 25
    ): Promise<ApiResponse<QuoteInsertResponse>> => {
        return this.get(`/quotes/${quoteId}/run`, {
            top: showTop,
            paymentFreq: 'Monthly',
        });
    }
}
