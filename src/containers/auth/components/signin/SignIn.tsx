import React from 'react';
import { useForm } from 'react-hook-form';
import s from './SignIn.module.scss';
import cx from 'classnames';

interface SignInInfo {
    email: string;
    password: string;
}

interface SignInProps {
    onSubmit: (info: SignInInfo) => any;
    onSwitch?: () => any;
}

const SignIn: React.FC<SignInProps> = ({ onSubmit, onSwitch }) => {
    const { register, handleSubmit, formState } = useForm<SignInInfo>({ reValidateMode: 'onChange', defaultValues: {email: '', password: ''} });

    return (
        <>
            <div className={s.formTitle}>Sign In</div>
            <form className={s.signInForm} onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email Address</label>
                <input placeholder="email@example.com" className="input" name="email" ref={register} />
                <label htmlFor="password">Password</label>
                <input placeholder="Password" className="input" name="password" type="password" ref={register} />
                <button className="primary full button" disabled={!formState.isValid} type="submit">Continue</button>
                <button className={cx('full outline button', s.switch)} onClick={onSwitch}>Sign Up Instead</button>
            </form>
        </>
    );
};

export default SignIn;