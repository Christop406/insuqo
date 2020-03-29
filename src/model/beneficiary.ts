import { Beneficiary as DatabaseBeneficiary } from '@insuqo/shared';

export declare type Beneficiary = Omit<DatabaseBeneficiary, 'application'>;