import React, { CSSProperties } from 'react';
import s from './RadioGroup.module.scss';
import cx from 'classnames';

export interface RadioOption<T = any> {
    value: T;
    name: string;
}

interface RadioGroupProps {
    value?: any;
    onChange?: (newValue: any) => any;
    options?: RadioOption[];
    name?: string;
    style?: CSSProperties;
    className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, options, onChange, name, className, style }) => {

    const buildRadioButtons = (options: RadioOption[] = []) => {
        return options.map((o, i) =>
            <label key={`${i}${o.value}`} className={s.radio}>
                <input type="radio" checked={value === o.value} name={name} value={o.value} onChange={(e) => onChange && onChange(e.target.value)} />
                {o.name}
            </label>
        );
    };

    return (
        <div style={style} className={cx(s.group, className)}>
            {buildRadioButtons(options)}
        </div>
    );
};