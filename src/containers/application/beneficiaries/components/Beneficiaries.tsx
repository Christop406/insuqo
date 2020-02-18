import React, { useState } from 'react';
import { Beneficiary } from '@insuqo/shared';
import s from './Beneficiaries.module.scss';
import BeneficiaryListItem from 'components/beneficiary/BeneficiaryListItem';
import BeneficiaryChart from 'components/beneficiary-chart/BeneficiaryChart';
import cx from 'classnames';

interface BeneficiariesProps {
    onSubmit: (beneficiaries: Beneficiary[]) => any;
    beneficiaries?: Beneficiary[];
}

const Beneficiaries: React.FC<BeneficiariesProps> = ({ beneficiaries, onSubmit }) => {
    beneficiaries = beneficiaries || [];

    const [bens, setBens] = useState(beneficiaries);

    const updateBeneficiary = (index: number, beneficiary: Beneficiary) => {
        const newBens = [...bens.slice(0, index), beneficiary, ...bens.slice(index + 1)];
        setBens(newBens);
    };

    const removeBeneficiary = (index: number) => {
        setBens(bens.filter((b, i) => i !== index));
    };

    const addBeneficiary = () => {
        const newBens = [...bens, {}];
        setBens(newBens as any[]);
    };

    return (
        <div className={s.container}>
            <h1>Add Beneficiaries</h1>
            <div className={s.beneficiaryList}>
                <form onSubmit={console.log}>
                    {bens.map((b, i) => <BeneficiaryListItem
                        onClose={() => removeBeneficiary(i)}
                        onChange={(ben) => updateBeneficiary(i, ben)}
                        key={i}
                        beneficiary={b} />)}
                </form>
                <button type="submit" onClick={addBeneficiary} className="button full primary outline">Add Beneficiary</button>
            </div>
            <div className={s.beneficiaryChart}>
                <BeneficiaryChart beneficiaries={bens} />
            </div>
            <input type="submit" onClick={() => onSubmit && onSubmit(bens)} className={cx('button full primary', s.submitButton)}></input>
        </div>
    );
};

export default Beneficiaries;