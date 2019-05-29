import axios from 'axios';
import querystring from "querystring";
import constants from './util/constants';
//let apiUrl = "https://api.insuqo.com";
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
        return Promise.reject("zip_invalid")
    }
    return axios.get(apiUrl + "/util/zip/lookup", {
        params: {
            zip: zip
        }
    })
}

export function login(type, email, password) {
    if(email == null || password == null || (type !== constants.userTypes.client && type !== constants.userTypes.agent)) return Promise.reject("invalid username/password/type");
    return axios.post(apiUrl + "/" + type + "/login", querystring.stringify({
        email,
        password
    }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });
}
