export function reduceQuote(quote) {
    var q = {};
    q.recID = quote.recID;
    q.companyID = quote.companyID;
    q.term = quote.term;
    q.companyName = quote.companyName;
    q.amBest = quote.amBest;
}

export function formatCovAmount(x) {
    if(x === undefined) return '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function logoImageForCompanyID(id) {
    switch(id) {
        case 54: return 'https://www.aig.com/content/dam/global/site-level-elements/logo/aig-logo.svg';
        case 93: return 'https://static.lgamerica.com/assets/images/ui/lga-logo-98x83-2x.png';
        case 110: return 'https://www.protective.com/theme/img/Logo_200.png';
        default:
            return undefined;
    }
}

export function splitPrice(price) {
    if(price == null) {
        return ['0', '00'];
    }

    let splitString = String(price).split('.');
    if(splitString[0] === undefined) {
        splitString[0] = '0';
    }
    if(splitString[1] === undefined) {
        splitString[1] = '00';
    } else {
        splitString[1] = splitString[1].substring(0, 2);
    }

    return splitString;
}

export function fillStoreFromLocalStorage(store) {
    return new Promise(function(resolve, reject) {
        if(localStorage.getItem("store_persisted") === "true") {
            Object.assign(store.state, localStorage);
            resolve(store.state);
        }
        reject(store.state);
    });
}

export function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}