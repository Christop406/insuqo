import axios from 'axios';
import * as qs from 'query-string';
import constants from './util/constants';
let apiUrl = process.env.REACT_APP_API_URL;

export function getApplication(app) {
    return axios.get(apiUrl + "/application/" + app, {
        headers: {
            "Authorization": getAuthHeader(localStorage.getItem("lt"))
        }
    });
}

export function newApplication(app) {
    console.log(app, JSON.stringify(app));
    return axios.put(apiUrl + "/applications/new", JSON.stringify(app),{
        headers: {
            "Content-Type": 'application/json'
        }
    });
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
    return axios.post(apiUrl + "/" + type + "/login", qs.stringify({
        email,
        password
    }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });
}

export function getUserInfo(type) {
    if(type !== constants.userTypes.client && type !== constants.userTypes.agent) return Promise.reject("invalid username/password/type");

    let tok = localStorage.getItem("lt");
    console.log(tok);
    if( tok !== undefined ) {
        return axios.get(apiUrl + "/" + type + "/info", {
            headers: {
                "Authorization" : getAuthHeader(tok)
            }
        });
    } else {
        return Promise.reject("no_jwt");
    }
}


function getAuthHeader(jwt) {
    return 'Bearer ' + jwt;
}
