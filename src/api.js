import axios from 'axios';
import querystring from "querystring";
//let apiUrl = "https://viscosity-api.herokuapp.com";
let apiUrl = "http://localhost:4567";

export function getQuote(state, actualAge, nearestAge, amount, termLength, healthType, sex, rider, showTop) {
    return axios.post(apiUrl + "/quote", querystring.stringify({
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

export function localizeZip(zip) {
    if(zip == null || zip === undefined || zip.length < 5) {
        return null;
    }
    return axios.get(apiUrl + "/util/zip/lookup", {
        params: {
            zip: zip
        }
    })
}