import {QuickTermQuoteResult} from '@insuqo/shared';

export declare type DynamoQuote = QuickTermQuoteResult;
export declare type QuoteInsertResponse = {key: string; quotes: DynamoQuote[]};
