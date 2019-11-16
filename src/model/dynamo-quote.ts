import {DynamoType, QuickTermQuoteResult} from "insuqo-shared";

export declare type DynamoQuote = QuickTermQuoteResult & DynamoType;
export declare type QuoteInsertResponse = {key: string, quotes: DynamoQuote[]};
