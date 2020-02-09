import React from 'react';
import s from './ClientAuthentication.module.scss';
import { AuthenticationForm } from '../../components/authentication/AuthenticationForm';
import { AuthenticationService } from '../../services/authentication.service';
import { AuthChallengeName } from '@insuqo/shared/types/auth-challenge-name';
import { Auth } from 'aws-amplify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Firebase from '../../services/firebase';
import { FirebaseError } from '../../model/auth';
import { auth } from 'firebase';
import iqLogo from '../../assets/img/insuqo-logo.png';
import cx from 'classnames';

interface ClientAuthenticationProps {
    onAuthenticate: (user: auth.UserCredential) => unknown;
    type?: 'login' | 'signup';
}

interface ClientAuthenticationState {
    paneType: 'login' | 'signup';
    userNeedsConfirmation: boolean;
    authChallengeRequired: boolean;
    authChallengeName?: AuthChallengeName;
    email: string;
    title: string;
    description?: string;
    formErrorText?: string;
    savedUserInfo?: { email: string; password: string };
}

export class ClientAuthentication extends React.Component<ClientAuthenticationProps, ClientAuthenticationState> {

    private user?: auth.UserCredential = undefined;

    state: ClientAuthenticationState = {
        paneType: this.props.type || 'login',
        userNeedsConfirmation: false,
        authChallengeRequired: false,
        authChallengeName: undefined,
        email: '',
        title: this.props.type === 'login' ? 'Log In' : 'Sign Up',
        formErrorText: undefined
    };

    public signUp = async (email: string, password: string) => {
        try {
            const signUpRes = await Firebase.auth.createUserWithEmailAndPassword(email, password);
            if (!signUpRes.user?.emailVerified) {
                await signUpRes.user?.sendEmailVerification();
                await Firebase.auth.signOut();
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

    public logIn = async (email: string, password: string) => {
        try {
            const user = await Firebase.auth.signInWithEmailAndPassword(email, password);
            console.log(user, user.user?.displayName);
            this.props.onAuthenticate(user);
        } catch (err) {
            let formErrorText: string | undefined = undefined;
            switch (err.code as FirebaseError) {
                case FirebaseError.UserNotFound:
                    formErrorText = 'User not found';
                    break;
                case FirebaseError.WrongPassword:
                    formErrorText = 'Password is incorrect';
            }
            this.setState({ formErrorText });
        }
    };

    public answerAuthChallenge = async (answer: string) => {
        const { authChallengeName, savedUserInfo } = this.state;
        switch (authChallengeName as unknown as AuthChallengeName) {
            case AuthChallengeName.SoftwareTokenMFA:
            case AuthChallengeName.SmsMFA:
                this.user = await Auth.confirmSignIn(this.user, answer, authChallengeName as any);
                break;
            case AuthChallengeName.MFARequired: // MFA_SETUP (should not be needed)
                break;
            case AuthChallengeName.NewPasswordRequired:
                this.user = await Auth.completeNewPassword(this.user, answer, undefined);
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
        await AuthenticationService.confirmSignUp(this.state.email, confirmationCode);
        const { savedUserInfo } = this.state;

        if (savedUserInfo) {
            await this.logIn(savedUserInfo.email, savedUserInfo.password);
        }

        this.props.onAuthenticate(this.user!);
    };

    public switchPaneType = () => {
        const { paneType } = this.state;
        const isLogin = paneType === 'login';
        this.setState({
            paneType: isLogin ? 'signup' : 'login',
            title: !isLogin ? 'Log In' : 'Sign Up'
        });
    };

    public render = (): React.ReactElement | any => {
        const { paneType, userNeedsConfirmation, authChallengeRequired, authChallengeName, title, formErrorText } = this.state;
        return (
            <div className={s.modalContainer}>
                <div className={s.authContainer}>
                    <div className={s.left}></div>
                    <div className={s.authForm}>
                        <img className={s.iqLogo} alt="INSUQO Logo" src={iqLogo} />
                        <div className={s.formTitle}>{title}</div>
                        <input placeholder="Email Address" className="input"></input>
                        <input placeholder="Password" type="password" className="input"></input>
                        <span className={cx('form-help', s.formHelp)}><button className="button text">Forgot password?</button></span>
                        <button className="button full primary">Continue</button>
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