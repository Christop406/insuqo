import { QuickTermQuoteResult, PremiumMode } from '@insuqo/shared';

export class QuoteHelper {
    public static quoteSortValue(a: QuickTermQuoteResult, b: QuickTermQuoteResult, frequency: PremiumMode): number {
        let property: keyof QuickTermQuoteResult = 'MonthlyTotalPremium';
        switch (frequency) {
            case PremiumMode.QUARTERLY:
                property = 'QuarterlyTotalPremium';
                break;
            case PremiumMode.SEMI_ANNUALLY:
                property = 'SemiAnnualTotalPremium';
                break;
            case PremiumMode.ANNUAL:
                property = 'AnnualTotalPremium';
                break;
        }
    
        return Number(a[property]) - Number(b[property]);
    }
}