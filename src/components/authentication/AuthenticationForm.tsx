import React from 'react';
import s from './AuthenticationForm.module.scss';
import {Formik, FormikErrors, FormikValues} from 'formik';
import {Validator} from '../../services/Validator';
import {AuthChallengeName} from '@insuqo/shared/types/auth-challenge-name';
import {PasswordSecurity} from '../password-security/PasswordSecurity';

interface AuthenticationFormProps {
    onSubmit: (...args: any) => unknown;
    type: 'login' | 'signup' | 'challenge';
    // modal?: boolean;
    challengeName?: AuthChallengeName | string;
}

interface SubFormProps {
    onSubmit: any;
}

interface ChallengeFormProps {
    onSubmit: (challengeResponse: string) => any;
    challengeName: AuthChallengeName | string;
}

export const AuthenticationForm: React.FunctionComponent<AuthenticationFormProps> = (props) => {
    return (
        <div className={s['authentication-form']}>
            {props.type === 'signup' && <SignUpForm {...props}/>}
            {props.type === 'login' && <LoginForm {...props}/>}
            {props.type === 'challenge' && <ChallengeForm challengeName={props.challengeName!} {...props}/>}
        </div>
    );
};

const ChallengeForm: React.FunctionComponent<ChallengeFormProps> = (props) => {
    return (
        <Formik onSubmit={(values) => props.onSubmit(values.challengeResponse)} initialValues={{challengeResponse: ''}}>
            {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
            }) =>
                <form className="auth-container" onSubmit={handleSubmit}>
                    <span>Your Code</span>
                    <input
                        className={`${s.input} input`}
                        placeholder="Code"
                        type="text"
                        name="challengeResponse"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.challengeResponse}
                    />
                    <button className={`${s['submit-button']} full primary button`} disabled={isSubmitting}
                        type="submit">Submit
                    </button>
                </form>
            }
        </Formik>
    );
};

const SignUpForm: React.FunctionComponent<SubFormProps> = (props) => {
    const validateSignUpForm = (values: FormikValues) => {
        const errors: FormikErrors<{
            email: string;
            password: string[];
            passwordConf?: string;
        }> = {};

        const passValidationResult = Validator.validatePassword(values.password || '');
        if (passValidationResult.length > 0) {
            errors.password = passValidationResult || [];
        }
        if (values.password !== values.passwordConf) {
            errors.passwordConf = 'Passwords must match.';
        }
        return errors;
    };

    return (
        <Formik
            validateOnChange
            validate={validateSignUpForm}
            initialValues={{email: '', password: '', passwordConf: ''}}
            onSubmit={(values) => props.onSubmit(values.email, values.password)}
        >
            {({
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid
            }) =>
                <form className="auth-container" onSubmit={handleSubmit}>
                    <span className={s['form-label']}>Email Address</span>
                    <input
                        className={`${s.input} input`}
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    <span className="error-text">{errors && errors.email}</span>
                    <span className={s['form-label']}>Password</span>
                    <input
                        className={`${s.input} input`}
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                    />
                    <PasswordSecurity valid={isValid} requirements={errors.password as any}/>
                    <span className={s['form-label']}>Confirm Password</span>
                    <input
                        className={`${s.input} input`}
                        type="password"
                        placeholder="Confirm Password"
                        name="passwordConf"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.passwordConf}
                    />
                    <span className="error-text">{errors && errors.passwordConf}</span>
                    <button className={`${s['submit-button']} full primary button`} disabled={isSubmitting}
                        type="submit">Submit
                    </button>
                </form>
            }
        </Formik>
    );
};

const LoginForm: React.FunctionComponent<SubFormProps> = (props) => {
    const validateSignUpForm = (values: FormikValues) => {
        const errors: typeof values = {};

        if (values.password.length < 8) {
            errors.password = 'Please enter a valid password';
        }
        return errors;
    };

    return (
        <Formik
            validateOnChange
            validate={validateSignUpForm}
            initialValues={{email: '', password: '', passwordConf: ''}}
            onSubmit={(values) => props.onSubmit(values.email, values.password)}
        >
            {({
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
            }) =>
                <form className="auth-container" onSubmit={handleSubmit}>
                    <span className={s['form-label']}>Email Address</span>
                    <input
                        className={`${s.input} input`}
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    <span className="error-text">{errors && errors.email}</span>
                    <span className={s['form-label']}>Password</span>
                    <input
                        className={`${s.input} input`}
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                    />
                    <span className="error-text">{errors && errors.password}</span>
                    <button className={`${s['submit-button']} full primary button`} disabled={isSubmitting}
                        type="submit">Submit
                    </button>
                </form>
            }
        </Formik>
    );
};
