import axios from 'axios';
import querystring from "querystring";
//let apiUrl = "https://iq-api.herokuapp.com";
let apiUrl = "http://localhost:4567";

export function getQuote(state, actualAge, nearestAge, amount, termLength, healthType, sex, rider, showTop) {

    let array = [state, actualAge, nearestAge, amount, termLength, healthType, sex, rider, showTop];

    if(array.some(el => el === undefined)) {
        return Promise.reject("undfined_data");
    }

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

export function getApplication(app) {
    return axios.get(apiUrl + "/application/" + app);
}

export function newApplication(app) {
    return axios.post(apiUrl + "/application/new",
        app
    , {})
}

export function localizeZip(zip) {
    if(zip == null || zip.length < 5) {
        return null;
    }
    return axios.get(apiUrl + "/util/zip/lookup", {
        params: {
            zip: zip
        }
    })
}