import React from 'react';
import cx from 'classnames';
import { PremiumMode } from '@insuqo/shared';
import s from './FrequencySelector.module.scss';
import { useFormContext } from 'react-hook-form';

interface FrequencySelectorProps {
    cost: number;
    frequency: PremiumMode;
    selected: boolean;
    onSelect: (frequency: PremiumMode) => any;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({ cost, frequency, selected, onSelect }) => {
    const { register } = useFormContext();
    return (
        <label className={cx(s.clickTarget, selected ? s.selected : undefined)} htmlFor={`freq-${frequency}`}>
            <div>${Number(cost).toFixed(2)}</div>
            <div className={s.frequencyLabel}>{frequencyNames[frequency]}</div>
            <input name="paymentFrequency" className={s.radioButton} checked={selected} onChange={() => onSelect(frequency)} id={`freq-${frequency}`} type="radio" ref={register} value={frequency} />
        </label>
    );
};

const frequencyNames = {
    [PremiumMode.MONTHLY]: 'Monthly',
    [PremiumMode.QUARTERLY]: 'Quarterly',
    [PremiumMode.SEMI_ANNUALLY]: 'Semi-Annually',
    [PremiumMode.ANNUAL]: 'Annually'
};

export default FrequencySelector;