import React, { useState } from 'react';
import { Range } from 'react-range';
import s from './Slider.module.scss';

interface SliderProps {
    min?: number;
    max?: number;
    steps?: number;
    stepSize?: number;
    name?: string;
    initialValue?: number;
    onChange: (val: number) => any;
}

export const Slider: React.FC<SliderProps> = ({ min, max, onChange, steps, stepSize, initialValue }) => {
    min = min || 0;
    max = max || 100;
    steps = steps || 10;

    stepSize = stepSize || (max - min) / steps;

    const [value, setValue] = useState(initialValue || (min + max) / 2);

    const handleChange = (vals: number[]) => {
        const [val] = vals;
        setValue(val);
        onChange(val);
    };

    return (
        <Range values={[value]} step={stepSize} min={min} max={max} onChange={handleChange} renderTrack={({ props, children }) => (
            <div {...props} className={s.track} style={props.style}>
                {children}
            </div>
        )} renderThumb={({ props }) => (
            <div {...props} className={s.handle} style={props.style} >
                <div className={s.indicator} />
            </div>
        )} />
    );
};