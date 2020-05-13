import React from 'react';
import { useForm } from 'react-hook-form';
import s from './SignIn.module.scss';
import cx from 'classnames';
import { Validator } from 'services/Validator';

interface SignInInfo {
    email: string;
    password: string;
}

interface SignInProps {
    onSubmit: (info: SignInInfo) => any;
    onSwitch?: () => any;
}

const SignIn: React.FC<SignInProps> = ({ onSubmit, onSwitch }) => {
    const { register, handleSubmit, formState } = useForm<SignInInfo>({ mode: 'onChange', reValidateMode: 'onChange' });

    return (
        <>
            <div className={s.formTitle}>Sign In</div>
            <form className={s.signInForm} onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email Address</label>
                <input placeholder="email@example.com" className="input" name="email" ref={register({
                    validate: Validator.validateEmail,
                })} />
                <label htmlFor="password">Password</label>
                <input placeholder="Password" className="input" name="password" type="password" ref={register({
                    validate: Validator.isValidPassword,
                })} />
                <button className="primary full button" disabled={!formState.isValid} type="submit">Continue</button>
                <button className={cx('full outline button', s.switch)} onClick={onSwitch}>Sign Up Instead</button>
            </form>
        </>
    );
};

export default SignIn;