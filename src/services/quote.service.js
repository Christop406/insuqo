import axios from "axios";
import * as querystring from "query-string";

export class QuoteService {
    static getQuote = (state, actualAge, nearestAge, amount, termLength, healthType, sex, rider, showTop) => {

        let array = [state, actualAge, nearestAge, amount, termLength, healthType, sex, rider, showTop];

        if (array.some(el => el === undefined)) {
            return Promise.reject("undefined_data");
        }

        return axios.post(process.env.REACT_APP_API_URL + "/quote", querystring.stringify({
            state: state,
            actualAge: actualAge,
            nearestAge: nearestAge,
            amount: amount,
            termLength: termLength,
            healthType: healthType,
            sex: sex,
            rider: rider,
            top: showTop
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}
