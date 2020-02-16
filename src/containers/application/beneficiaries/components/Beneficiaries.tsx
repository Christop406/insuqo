import React from 'react';
import { Beneficiary, Application } from '@insuqo/shared';
import s from './Beneficiaries.module.scss';
import { useForm, FormContext } from 'react-hook-form';
import BeneficiaryListItem from 'components/beneficiary/BeneficiaryListItem';
import BeneficiaryChart from 'components/beneficiary-chart/BeneficiaryChart';

interface BeneficiariesProps {
    beneficiaries: Beneficiary[];
    application: Application;
    onSubmit: (application: Application) => any;
}

const Beneficiaries: React.FC<BeneficiariesProps> = ({ beneficiaries, application, onSubmit }) => {
    const methods = useForm<Application>({ mode: 'onChange', defaultValues: application });

    const { handleSubmit } = methods; // register, errors

    return (
        <div className={s.container}>
            <h1>Add Beneficiaries</h1>
            <div className={s.beneficiaryList}>
                <FormContext {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {beneficiaries.map((b, i) => <BeneficiaryListItem key={i} initialValue={b} edit={false}/>)}
                    </form>
                </FormContext>
                <button className="button full primary outline">Add Beneficiary</button>
            </div>
            <div className={s.beneficiaryChart}>
                <BeneficiaryChart beneficiaries={beneficiaries} />
            </div>
        </div>
    );
};

export default Beneficiaries;