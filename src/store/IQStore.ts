import { createConnectedStore, Effects, Store } from 'undux';
import { Application } from '@insuqo/shared/types/application';
import { Beneficiary } from '../model/beneficiary';
import { QuickTermQuoteResult, Quote } from '@insuqo/shared';
import { ZipCode } from '@insuqo/shared/types/zip-code';

interface IQStoreState {
    location: ZipCode | undefined;
    quote: Quote | undefined;
    application: Application | undefined;
    chosenQuote: QuickTermQuoteResult | undefined;
    beneficiaries: Beneficiary[] | undefined;
}

const initialState: IQStoreState = {
    location: undefined,
    quote: undefined,
    application: undefined,
    chosenQuote: undefined,
    beneficiaries: undefined,
};

export default createConnectedStore(initialState);

export interface IQStoreProps {
    store: Store<IQStoreState>;
}

export type IQStoreEffects = Effects<IQStoreState>;

