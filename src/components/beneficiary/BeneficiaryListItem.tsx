import React from 'react';
import { Beneficiary } from '@insuqo/shared/types/application';
import s from './BeneficiaryListItem.module.scss';
import relations from '@insuqo/shared/constants/relations.json';

interface BeneficiaryListItemProps {
    initialValue: Beneficiary;
    edit: boolean;
}

const BeneficiaryListItem: React.FC<BeneficiaryListItemProps> = ({ initialValue, edit }) => {
    return (
        <div className={s.container}>
            <div className={s.infoContainer}>
                <div className={s.beneficiaryName}>{initialValue.firstName} {initialValue.middleInitial} {initialValue.lastName}</div>
                <div>{relations.find((r) => r.code === initialValue.relationship)?.name}</div>
            </div>
            <div className={s.shareContainer}>
                <div className={s.shareLabel}>{initialValue.percentage}%</div>
            </div>
        </div>
    );
};

export default BeneficiaryListItem;