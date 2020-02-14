import React, { useState } from 'react';
import { PremiumMode } from '@insuqo/shared';
import s from './PaymentFrequency.module.scss';
import cx from 'classnames';
import FrequencySelector from './FrequencySelector/FrequencySelector';

interface PaymentFrequencyProps {
    monthly?: number | string;
    quarterly?: number | string;
    semiAnnually?: number | string;
    annually?: number | string;
}

const PaymentFrequency: React.FC<PaymentFrequencyProps> = ({ monthly, quarterly, annually, semiAnnually }) => {
    const [selected, setSelected] = useState(PremiumMode.MONTHLY);
    return (
        <div className="row w-100">
            <div className="row col-sm">
                <div className={cx(s.frequencySelector, 'col')}>
                    <FrequencySelector
                        onSelect={setSelected}
                        selected={selected === PremiumMode.MONTHLY}
                        cost={Number(monthly)}
                        frequency={PremiumMode.MONTHLY} />
                </div>
                <div className={cx(s.frequencySelector, 'col')}>
                    <FrequencySelector
                        onSelect={setSelected}
                        selected={selected === PremiumMode.QUARTERLY}
                        cost={Number(quarterly)}
                        frequency={PremiumMode.QUARTERLY} />
                </div>
            </div>
            <div className="row col-sm">
                <div className={cx(s.frequencySelector, 'col')}>
                    <FrequencySelector
                        onSelect={setSelected}
                        selected={selected === PremiumMode.SEMI_ANNUALLY}
                        cost={Number(semiAnnually)}
                        frequency={PremiumMode.SEMI_ANNUALLY} />
                </div>
                <div className="col">
                    <FrequencySelector
                        onSelect={setSelected}
                        selected={selected === PremiumMode.ANNUAL}
                        cost={Number(annually)}
                        frequency={PremiumMode.ANNUAL} />
                </div>
            </div>
        </div>
    );
};

export default PaymentFrequency;