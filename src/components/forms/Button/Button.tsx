import React from 'react';
import s from './Button.module.scss';
import cx from 'classnames';
import { Link } from 'react-router-dom';

interface ButtonProps {
    disabled?: boolean;
    label?: string;
    type?: 'submit' | 'button' | 'reset' | 'anchor' | 'link';
    full?: boolean;
    primary?: boolean;
    className?: string;
    text?: boolean;
    outline?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    href?: string;
}

export const Button: React.FC<ButtonProps> = ({
    disabled,
    children,
    label,
    type,
    full,
    primary,
    className,
    text,
    outline,
    onClick,
    href,
}) => {

    // defaults

    const props = {
        className: cx(
            s.button,
            full && s.full,
            primary && s.primary,
            text && s.text,
            outline && s.outline,
            className,
        ),
        disabled,
        onClick,
    };

    if (type === 'anchor') {
        return (
            <a href={href} {...props as any}>{children || label}</a>
        );
    } else if (type === 'link') {
        return (
            <Link to={href || ''} {...props as any} >{children || label}</Link>
        );
    } else {
        return (
            <button {...props} type={type || 'button'}>{children || label}</button>
        );
    }
};