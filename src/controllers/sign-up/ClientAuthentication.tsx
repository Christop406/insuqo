import React from 'react';
import s from './ClientAuthentication.module.scss';
import {AuthenticationForm} from "../../components/authentication/AuthenticationForm";
import {AuthenticationService} from "../../services/authentication.service";
import {CognitoUser} from "amazon-cognito-identity-js";
import {AuthChallengeName} from "insuqo-shared/types/auth-challenge-name";
import {Auth} from "aws-amplify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface ClientAuthenticationProps {
    onAuthenticate: (user: CognitoUser) => unknown;
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
}

export class ClientAuthentication extends React.Component<ClientAuthenticationProps, ClientAuthenticationState> {

    private cognitoUser?: CognitoUser = undefined;

    state = {
        paneType: this.props.type || 'login',
        userNeedsConfirmation: false,
        authChallengeRequired: false,
        authChallengeName: undefined,
        email: '',
        title: this.props.type === 'login' ? 'Log In' : 'Sign Up',
        formErrorText: undefined
    };

    public signUp = async (email: string, password: string) => {
        const signUpRes = await AuthenticationService.signUp(email, password);
        this.setState({userNeedsConfirmation: !signUpRes.userConfirmed, email});

        if (signUpRes.userConfirmed && this.props.onAuthenticate) {
            this.props.onAuthenticate(signUpRes.user);
        }
    };

    public logIn = async (email: string, password: string) => {
        try {
            const loginRes = await AuthenticationService.login(email, password);
            this.cognitoUser = loginRes;

            if (loginRes.challengeName) {
                this.setState({
                    authChallengeRequired: true,
                    authChallengeName: loginRes.challengeName
                });
            } else {
                if (this.props.onAuthenticate) {
                    this.props.onAuthenticate(this.cognitoUser);
                }
            }
        } catch (error) {
            this.setState({formErrorText: error.message});
        }
    };

    public answerAuthChallenge = async (answer: string) => {
        const {authChallengeName} = this.state;
        switch (authChallengeName as unknown as AuthChallengeName) {
            case AuthChallengeName.SoftwareTokenMFA:
            case AuthChallengeName.SmsMFA:
                this.cognitoUser = await Auth.confirmSignIn(this.cognitoUser, answer, authChallengeName);
                break;
            case AuthChallengeName.MFARequired: // MFA_SETUP
                break;
            case AuthChallengeName.NewPasswordRequired:
                this.cognitoUser = await Auth.completeNewPassword(this.cognitoUser, answer, undefined);
                break;
        }
        if (!this.cognitoUser) {
            throw new Error('Cognito returned no user after the auth challenge.');
        }
        if ((this.cognitoUser as any).challengeName) {
            throw new Error('User needed to answer another challenge but that functionality is not implemented.');
        }
        if (this.props.onAuthenticate) {
            this.props.onAuthenticate(this.cognitoUser);
        }
    };

    public sendConfirmation = async (confirmationCode: string) => {
        const res = await AuthenticationService.confirmSignUp(this.state.email, confirmationCode);
        console.log(res);
        // continue with application after user is signed in
    };

    public switchPaneType = () => {
        const {paneType} = this.state;
        const isLogin = paneType === 'login';
        this.setState({
            paneType: isLogin ? 'signup' : 'login',
            title: !isLogin ? 'Log In' : 'Sign Up'
        });
    };

    public render = (): React.ReactElement | any => {
        const {paneType, userNeedsConfirmation, authChallengeRequired, authChallengeName, title, formErrorText} = this.state;
        return (
            <div className={s['modal-container']}>
                <div className={s['auth-container']}>
                    <h2>{title}</h2>
                    {formErrorText && <span className={s['form-error']}><FontAwesomeIcon className={s['error-icon']} icon="exclamation-circle"/>{formErrorText}</span>}
                    {paneType === 'signup' &&
					<AuthenticationForm
						type={userNeedsConfirmation ? 'challenge' : 'signup'}
						onSubmit={userNeedsConfirmation ? this.sendConfirmation : this.signUp}/>}
                    {paneType === 'login' &&
					<AuthenticationForm
						onSubmit={authChallengeRequired ? this.answerAuthChallenge : this.logIn}
						challengeName={authChallengeName}
						type={authChallengeRequired ? 'challenge' : 'login'}/>}
                    <button className={`${s['mode-switcher']} full primary text button`} onClick={this.switchPaneType}>Switch
                        to {paneType === 'login' ? 'Sign Up' : 'Log In'}</button>
                </div>
            </div>
        );
    };
}
