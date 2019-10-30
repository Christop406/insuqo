import axios from "axios";
import * as querystring from "query-string";

export class QuoteService {
    public static getQuote = (
        state: string,
        actualAge: number,
        nearestAge: number,
        amount: number,
        termLength: number,
        healthType: any,
        sex: any,
        rider: any,
        showTop: any
    ) => {

        let array = [state, actualAge, nearestAge, amount, termLength, healthType, sex, rider, showTop];

        if (array.some(el => el === undefined)) {
            return Promise.reject("undefined_data");
        }

        return axios.get(process.env.REACT_APP_API_URL + "/quotes/get", {
            params: {
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
            },
        });
    }
}
