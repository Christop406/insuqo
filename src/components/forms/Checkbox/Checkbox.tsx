import React, { CSSProperties } from 'react';
import s from './Checkbox.module.scss';

interface CheckboxProps {
    label?: string;
    children?: string;
    onChange?: (checked: boolean) => any;
    name?: string;
    style?: CSSProperties;
    checked?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, children, onChange, name, style, checked }) => {
    return (
        <label style={style} className={s.checkboxContainer}>
            <input checked={checked} className={s.checkbox} type="checkbox" onChange={(e) => onChange && onChange(e.target.checked)} name={name} />
            {label}
            {children}
        </label>
    );
};