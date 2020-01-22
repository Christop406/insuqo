export function reduceQuote(quote: any) {
    var q: any = {};
    q.recID = quote.recID;
    q.companyID = quote.companyID;
    q.term = quote.term;
    q.companyName = quote.companyName;
    q.amBest = quote.amBest;
}

export function formatCovAmount(x: number | string | undefined) {
    if(x === undefined) return '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function logoImageForCompanyID(id: number | string | undefined) {
    switch(id) {
        case 54: return 'https://www.aig.com/content/dam/global/site-level-elements/logo/aig-logo.svg';
        case 93: return 'https://static.lgamerica.com/assets/images/ui/lga-logo-98x83-2x.png';
        case 110: return 'https://www.protective.com/theme/img/Logo_200.png';
        default:
            return undefined;
    }
}

export function splitPrice(price: number | string) {
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

export function fillStoreFromLocalStorage(store: any) {
    return new Promise(function(resolve, reject) {
        if(localStorage.getItem("store_persisted") === "true") {
            Object.assign(store.state, localStorage);
            Object.assign(store.state, {
                quote: JSON.parse(localStorage.getItem('quote') || '{}'),
                quotes: JSON.parse(localStorage.getItem('quotes') || '{}')
            });
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

export function validateEmail(email: string) {
    var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
}