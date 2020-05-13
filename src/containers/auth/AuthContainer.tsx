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

type AuthContainerProps = RouteComponentProps & IQStoreProps & {
    formType?: 'signin' | 'signup';
};

interface AuthContainerState {
    formType: 'signup' | 'signin';
    userNeedsConfirmation?: boolean;
    formErrorText?: string;
    savedUserInfo?: any;
    showing: boolean;
}

class AuthContainer extends React.Component<AuthContainerProps, AuthContainerState> {

    state: AuthContainerState = {
        formType: this.props.formType || 'signin',
        showing: false,
    };

    componentDidMount(): void {
        Auth.subscribeAuthModalEvents((type) => {
            this.setState({
                showing: true,
                formType: type,
            });
        });
    }

    render() {
        const { formType, showing } = this.state;

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
                            <SignUp onSubmit={(i) => this.signUp(i)} onSwitch={this.handleSwitch} />
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
                await Auth.signOut();
                this.setState({ userNeedsConfirmation: true });
            } else {
                this.setState({ showing: false });
            }
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

    private handleSwitch = () => {
        const { formType } = this.state;
        this.setState({
            formType: formType === 'signin' ? 'signup' : 'signin',
        });
    };
}

export default IQStore.withStore(withRouter(AuthContainer));
