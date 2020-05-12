import React from 'react';
import { useForm } from 'react-hook-form';
import s from './SignUp.module.scss';
import cx from 'classnames';

interface SignUpInfo {
    email: string;
    password: string;
    passwordConfirm: string;
}

interface SignInProps {
    onSubmit: (info: SignUpInfo) => any;
    onSwitch?: () => any;
}

const SignUp: React.FC<SignInProps> = ({ onSubmit, onSwitch }) => {
    const { register, handleSubmit, watch, formState } = useForm<SignUpInfo>({reValidateMode: 'onChange'});

    return (
        <>
            <div className={s.formTitle}>Sign Up</div>
            <form className={s.signUpForm} onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email Address</label>
                <input placeholder="email@example.com" className="input" name="email" ref={register} />
                <label htmlFor="password">Password</label>
                <input placeholder="Password" className="input" name="password" type="password" ref={register} />
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input placeholder="Password Confirmation" className="input" name="passwordConfirm" type="password" ref={register({
                    validate: (value) => {
                        return value === watch('password');
                    },
                })} />
                <button className="full primary button" type="submit" disabled={!formState.isValid}>Sign Up</button>
                <button className={cx('full outline button', s.switch)} onClick={onSwitch}>Sign In Instead</button>
            </form>
        </>
    );
};

export default SignUp;