import { createConnectedStore, Effects, Store, withLogger } from 'undux';
import { Application, Beneficiary } from '@insuqo/shared/types/application';
import { QuickTermQuoteResult } from '@insuqo/shared';

interface IQStoreState {
    zipCode: string | undefined;
    stateName: string | undefined;
    stateCode: string | undefined;
    city: string | undefined;
    birthDate: string | undefined;
    sex: string | undefined;
    tobacco: boolean | undefined;
    cannabis: boolean | undefined;
    coverageAmount: number | undefined;
    termLength: number | undefined;
    planRider: string | undefined;
    application: Application | undefined;
    chosenQuote: QuickTermQuoteResult | undefined;
    beneficiaries: Beneficiary[] | undefined;
}

const initialState: IQStoreState = {
    zipCode: undefined,
    stateName: undefined,
    stateCode: undefined,
    city: undefined,
    birthDate: undefined,
    sex: undefined,
    tobacco: undefined,
    cannabis: undefined,
    coverageAmount: undefined,
    termLength: undefined,
    planRider: undefined,
    application: undefined,
    chosenQuote: undefined,
    beneficiaries: undefined,
};

export default createConnectedStore(initialState, withLogger);

export interface IQStoreProps {
    store: Store<IQStoreState>;
}

export type IQStoreEffects = Effects<IQStoreState>;

