import {ApiBaseService} from "./api-base.service";
import {DynamoQuote, QuoteInsertResponse} from "../model/dynamo-quote";
import {ApiResponse} from "insuqo-shared/types/api-response";

export class QuoteService extends ApiBaseService {

    public async getQuotesByKey(key: string): Promise<DynamoQuote[] | undefined> {
        return (await this.get<DynamoQuote[]>(`/quotes/get/${encodeURIComponent(key)}`)).data;
    }

    public runQuotes = (
        state: string,
        actualAge: number,
        nearestAge: number,
        amount: number,
        termLength: number,
        healthType: any,
        sex: any,
        rider: any,
        showTop: any
    ): Promise<ApiResponse<QuoteInsertResponse>> => {

        let requiredParams = [state, actualAge, nearestAge, amount, termLength, healthType, sex, rider, showTop];

        if (requiredParams.some(el => el === undefined)) {
            return Promise.reject("undefined_data");
        }

        return this.get("/quotes/run", {
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
