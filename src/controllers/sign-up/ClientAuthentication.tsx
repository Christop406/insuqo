import React from 'react';
import './ClientAuthentication.scss';
import {AuthenticationForm} from "../../components/authentication/AuthenticationForm";
import {AuthenticationService} from "../../services/authentication.service";
import {CognitoUser} from "amazon-cognito-identity-js";

interface ClientAuthenticationProps {
    onAuthenticate: (user: CognitoUser) => unknown;
    type?: 'login' | 'signup';
}

export class ClientAuthentication extends React.Component<ClientAuthenticationProps> {

    state = {
        paneType: this.props.type || 'login',
        userNeedsConfirmation: false,
        authChallengeRequired: false,
        email: ''
    };

    public signUp = async (email: string, password: string) => {
        const signUpRes = await AuthenticationService.signUp(email, password);
        this.setState({userNeedsConfirmation: !signUpRes.userConfirmed, email});
    };

    public logIn = async (email: string, password: string) => {
        const loginRes = await AuthenticationService.login(email, password);
        // handle auth challenges
    };

    public answerAuthChallenge = async (data: string) => {

    };

    public sendConfirmation = async (confirmationCode: string) => {
        const res = await AuthenticationService.confirmSignUp(this.state.email, confirmationCode);
        console.log(res);
        // continue with application after user is signed in
    };

    public switchPaneType = () => {
        const {paneType} = this.state;
        this.setState({paneType: paneType === 'login' ? 'signup' : 'login'});
    };

    public render = (): React.ReactElement | any => {
        const {paneType, userNeedsConfirmation, authChallengeRequired} = this.state;
        return (
            <>
                {paneType === 'signup' && <AuthenticationForm
					modal
					type={userNeedsConfirmation ? 'challenge' : 'signup'}
					onSubmit={userNeedsConfirmation ? this.sendConfirmation : this.signUp}/>}
                {paneType === 'login' &&
				<AuthenticationForm
                    modal
					onSubmit={authChallengeRequired ? this.answerAuthChallenge : this.logIn}
					type={authChallengeRequired ? 'challenge' : 'login'}/>}
                <button className="mode-switcher" onClick={this.switchPaneType}>Switch to {paneType === 'login' ? 'Sign Up' : 'Log In'}</button>
            </>
        );
    };
}
