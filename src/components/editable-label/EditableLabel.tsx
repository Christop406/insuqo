import React, { useState, useEffect } from 'react';
import AutosizeInput from 'react-input-autosize';
import s from './EditableLabel.module.scss';
import cx from 'classnames';

interface EditableLabelProps {
    initialValue?: string | number;
    value?: string | number;
    placeholder?: string;
    className?: string;
    onChange?: (value: string | number | undefined) => any;
    control?: any;
    name?: string;
}

const EditableLabel: React.FC<EditableLabelProps> = ({ initialValue, placeholder, className, name, value, onChange }) => {
    return (
        <AutosizeInput 
            placeholder={placeholder}
            value={value}
            className={cx(s.editableLabel, className)}
            name={name} 
            onChange={(e: any) => onChange && onChange(e.target.value)}/>
    );
};


export default EditableLabel;