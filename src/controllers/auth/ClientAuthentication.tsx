import React from 'react';
import s from './ClientAuthentication.module.scss';
import { AuthChallengeName } from '@insuqo/shared/types/auth-challenge-name';
import { Auth } from '../../services/firebase';
import { FirebaseError } from '../../model/auth';
import { auth } from 'firebase';
import iqLogo from '../../assets/img/insuqo-logo.png';
import cx from 'classnames';

interface ClientAuthenticationProps {
    onAuthenticate?: (user: auth.UserCredential) => unknown;
    type?: 'login' | 'signup';
}

interface ClientAuthenticationState {
    paneType: 'login' | 'signup';
    userNeedsConfirmation: boolean;
    authChallengeRequired: boolean;
    authChallengeName?: AuthChallengeName;
    email: string;
    password: string;
    title: string;
    description?: string;
    formErrorText?: string;
    savedUserInfo?: { email: string; password: string };
}

export default class ClientAuthentication extends React.Component<ClientAuthenticationProps, ClientAuthenticationState> {

    private user?: auth.UserCredential = undefined;

    state: ClientAuthenticationState = {
        paneType: this.props.type || 'login',
        userNeedsConfirmation: false,
        authChallengeRequired: false,
        authChallengeName: undefined,
        email: '',
        password: '',
        title: this.props.type === 'login' ? 'Log In' : 'Sign Up',
        formErrorText: undefined
    };

    public signUp = async (email: string, password: string) => {
        try {
            const signUpRes = await Auth.createUserWithEmailAndPassword(email, password);
            if (!signUpRes.user?.emailVerified) {
                await signUpRes.user?.sendEmailVerification();
                await Auth.signOut();
                this.setState({ userNeedsConfirmation: true });
            }
            console.log(signUpRes);
        } catch (err) {
            let formErrorText: string | undefined;
            switch (err.code as FirebaseError) {
                case FirebaseError.EmailAlreadyInUse:
                    formErrorText = 'Email already in use';
                    break;
                case FirebaseError.InvalidEmail:
                    formErrorText = 'Invalid Email Address';
                    break;
                case FirebaseError.WeakPassword:
                    formErrorText = 'Password too weak';
                    break;
            }
            this.setState({ formErrorText });
            console.error(err);
        }
    };

    public logIn = async (email?: string, password?: string) => {
        email = email || this.state.email;
        password = password || this.state.password;

        try {
            const user = await Auth.signInWithEmailAndPassword(email, password);
            console.log(user, user.user?.displayName);
            this.props.onAuthenticate && this.props.onAuthenticate(user);
        } catch (err) {
            let formErrorText: string | undefined = undefined;
            switch (err.code as FirebaseError) {
                case FirebaseError.UserNotFound:
                    formErrorText = 'User not found';
                    break;
                case FirebaseError.WrongPassword:
                    formErrorText = 'Password is incorrect';
            }
            this.setState({ formErrorText, savedUserInfo: { email, password } });
        }
    };

    public answerAuthChallenge = async () => {
        const { authChallengeName, savedUserInfo } = this.state;
        switch (authChallengeName as unknown as AuthChallengeName) {
            case AuthChallengeName.SoftwareTokenMFA:
            case AuthChallengeName.SmsMFA:
                // this.user = await Auth.confirmSignIn(this.user, answer, authChallengeName as any);
                break;
            case AuthChallengeName.MFARequired: // MFA_SETUP (should not be needed)
                break;
            case AuthChallengeName.NewPasswordRequired:
                // this.user = await Auth.completeNewPassword(this.user, answer, undefined);
                break;
        }
        if (!this.user) {
            throw new Error('Cognito returned no user after the auth challenge.');
        }
        if ((this.user as any).challengeName) {
            throw new Error('User needed to answer another challenge but that functionality is not implemented.');
        }

        if (savedUserInfo) {
            await this.logIn(savedUserInfo.email, savedUserInfo.password);
        }

        if (this.props.onAuthenticate) {
            this.props.onAuthenticate(this.user);
        }
    };

    public sendConfirmation = async (confirmationCode: string) => {
        // TODO: Implement
        console.log(confirmationCode);
    };

    public switchPaneType = () => {
        const { paneType } = this.state;
        const isLogin = paneType === 'login';
        this.setState({
            paneType: isLogin ? 'signup' : 'login',
            title: !isLogin ? 'Log In' : 'Sign Up'
        });
    };

    public updateEmail = (e: any) => {
        this.setState({ email: e.target.value });
    };

    public updatePassword = (e: any) => {
        this.setState({ password: e.target.value });
    };

    public render = (): React.ReactElement | any => {
        const { title } = this.state;
        return (
            <div className={s.modalContainer}>
                <div className={s.authContainer}>
                    <div className={s.left}></div>
                    <div className={s.authForm}>
                        <img className={s.iqLogo} alt="INSUQO Logo" src={iqLogo} />
                        <div className={s.formTitle}>{title}</div>
                        <form method="post" action="">
                            <input placeholder="Email Address" onChange={this.updateEmail} className="input"></input>
                            <input placeholder="Password" onChange={this.updatePassword} type="password" className="input"></input>
                            <span className={cx('form-help', s.formHelp)}><button className="button text">Forgot password?</button></span>
                            <button type="button" onClick={() => this.logIn()} className="button full primary">Continue</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    };
}


// <div className={s['modal-container']}>
// <div className={s['auth-container']}>
//     <h2>{title}</h2>
//     {formErrorText && <span className={s['form-error']}><FontAwesomeIcon className={s['error-icon']} icon="exclamation-circle" />{formErrorText}</span>}
//     {paneType === 'signup' &&
//         <AuthenticationForm
//             type={userNeedsConfirmation ? 'challenge' : 'signup'}
//             onSubmit={userNeedsConfirmation ? this.sendConfirmation : this.signUp} />}
//     {paneType === 'login' &&
//         <AuthenticationForm
//             onSubmit={authChallengeRequired ? this.answerAuthChallenge : this.logIn}
//             challengeName={authChallengeName}
//             type={authChallengeRequired ? 'challenge' : 'login'} />}
//     <button className={`${s['mode-switcher']} full primary text button`} onClick={this.switchPaneType}>Switch
//         to {paneType === 'login' ? 'Sign Up' : 'Log In'}</button>
// </div>
// </div>