import React from 'react';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'services/firebase';
import { FirebaseError } from 'model/auth';
import s from './AuthContainer.module.scss';
import iqLogo from '../../assets/img/insuqo-logo.png';
import SignIn from '../../controllers/auth/signin/SignIn';
import { Optional } from 'components/base/Optional';
import SignUp from '../../controllers/auth/signup/SignUp';
import { Verify } from 'controllers/auth/verify/Verify';

type AuthContainerProps = RouteComponentProps & IQStoreProps & {
    formType?: 'signin' | 'signup' | 'verify';
};

interface AuthContainerState {
    formType: 'signup' | 'signin' | 'verify';
    userNeedsConfirmation?: boolean;
    formErrorText?: string;
    savedUserInfo?: any;
    showing: boolean;
}

class AuthContainer extends React.Component<AuthContainerProps, AuthContainerState> {

    private callback?: (authData: any) => any;

    state: AuthContainerState = {
        formType: this.props.formType || 'signin',
        showing: false,
    };

    componentDidMount(): void {
        Auth.subscribeAuthModalEvents((event) => {
            this.setState({
                showing: true,
                formType: event.type,
            });
            this.callback = event.callback;
        });
    }

    render() {
        const { formType, showing, formErrorText } = this.state;

        if (!showing) {
            return <></>;
        }

        return <>
            <div className={s.modalContainer}>
                <div className={s.authContainer}>
                    <div className={s.left}></div>
                    <div className={s.authForm}>
                        <img className={s.iqLogo} alt="INSUQO Logo" src={iqLogo} />
                        <Optional condition={formType === 'signin'}>
                            <SignIn onSubmit={(i) => this.signIn(i)} onSwitch={this.handleSwitch} />
                        </Optional>
                        <Optional condition={formType === 'signup'}>
                            <SignUp errorText={formErrorText} onSubmit={(i) => this.signUp(i)} onSwitch={this.handleSwitch} />
                        </Optional>
                        <Optional condition={formType === 'verify'}>
                            <Verify onResend={() => this.resendVerificationCode()} onContinue={() => this.checkVerification()} />
                        </Optional>
                    </div>
                </div>
            </div>
        </>;
    }

    public signUp = async ({ email, password }: { email: string; password: string }) => {
        try {
            const signUpRes = await Auth.createUserWithEmailAndPassword(email, password);
            if (!signUpRes.user?.emailVerified) {
                await signUpRes.user?.sendEmailVerification();
                // this.setState({ formType: 'verify' });
            }
            this.setState({ showing: false });
            this.callback && this.callback(signUpRes.user);
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

    public signIn = async ({ email, password }: { email?: string; password?: string }) => {
        try {
            const user = await Auth.signInWithEmailAndPassword(email, password);
            this.setState({
                showing: false,
            });
            this.callback && this.callback(user.user);
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

    private resendVerificationCode = async () => {
        const usr = await Auth.getCurrentUser();
        await usr?.sendEmailVerification();
    };

    private checkVerification = async () => {
        const currentUser = await Auth.getCurrentUser();
        if (currentUser?.emailVerified) {
            this.setState({ showing: false });
        } else {
            this.setState({ formErrorText: 'Please Verify Email' });
        }
    };

    private handleSwitch = () => {
        const { formType } = this.state;
        this.setState({
            formType: formType === 'signin' ? 'signup' : 'signin',
        });
    };
}

export default IQStore.withStore(withRouter(AuthContainer));
