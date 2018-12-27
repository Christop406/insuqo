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
};

export function logoImageForCompanyID(id) {
    switch(id) {
        case 54: return 'https://www.aig.com/content/dam/global/site-level-elements/logo/aig-logo.svg';
        case 93: return 'https://static.lgamerica.com/assets/images/ui/lga-logo-98x83-2x.png';
        case 110: return 'https://www.protective.com/theme/img/Logo_200.png';
        default:
            return undefined;
    }
}