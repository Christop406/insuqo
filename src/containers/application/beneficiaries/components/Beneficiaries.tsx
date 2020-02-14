import React from 'react';
import { Beneficiary, Application } from '@insuqo/shared';
import s from './Beneficiaries.module.scss';
import { useForm, FormContext } from 'react-hook-form';
import BeneficiaryListItem from 'components/beneficiary/BeneficiaryListItem';

interface BeneficiariesProps {
    beneficiaries: Beneficiary[];
    application: Application;
    onSubmit: (application: Application) => any;
}

const Beneficiaries: React.FC<BeneficiariesProps> = ({ beneficiaries, application, onSubmit }) => {
    const methods = useForm<Application>({ mode: 'onChange', defaultValues: application });

    const { handleSubmit, register, errors } = methods;

    return (
        <div className={s.container}>
            <h1>Beneficiaries: {beneficiaries.length}</h1>
            <div className={s.beneficiaryList}>
                <FormContext {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {beneficiaries.map((b, i) => <BeneficiaryListItem key={i} initialValue={b} edit={false}/>)}
                    </form>
                </FormContext>
            </div>
        </div>
    );
};

export default Beneficiaries;