import React from 'react';
import { useForm } from 'react-hook-form';
import s from './SignUp.module.scss';
import cx from 'classnames';
import { Validator } from 'services/Validator';

interface SignUpInfo {
    email: string;
    password: string;
    passwordConfirm: string;
}

interface SignInProps {
    onSubmit: (info: SignUpInfo) => any;
    onSwitch?: () => any;
}

enum FormField {
    Email = 'email',
    Password = 'password',
    PasswordConfirm = 'passwordConfirm',
}

const SignUp: React.FC<SignInProps> = ({ onSubmit, onSwitch }) => {
    const { register, handleSubmit, watch, formState } = useForm<SignUpInfo>({ mode: 'onChange', reValidateMode: 'onChange' });

    return (
        <>
            <div className={s.formTitle}>Sign Up</div>
            <form className={s.signUpForm} onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor={FormField.Email}>Email Address</label>
                <input placeholder="email@example.com" className="input" name={FormField.Email} ref={register({
                    validate: Validator.validateEmail,
                })} />
                <label htmlFor={FormField.Password}>Password</label>
                <input placeholder="Password" className="input" name={FormField.Password} type="password" ref={register({
                    validate: Validator.isValidPassword,
                })} />
                <label htmlFor={FormField.PasswordConfirm}>Confirm Password</label>
                <input placeholder="Password Confirmation" className="input" name={FormField.PasswordConfirm} type="password" ref={register({
                    validate: (value) => {
                        return !!value.length && value === watch(FormField.Password);
                    },
                })} />
                <button className="full primary button" type="submit" disabled={!formState.isValid}>Sign Up</button>
                <button className={cx('full outline button', s.switch)} onClick={onSwitch}>Sign In Instead</button>
            </form>
        </>
    );
};

export default SignUp;