import {Auth} from 'aws-amplify';
import {CognitoUser, CognitoUserSession, ISignUpResult} from 'amazon-cognito-identity-js';
import {AuthChallengeName} from '@insuqo/shared/types/auth-challenge-name';

declare type LoginResponse = CognitoUser & { challengeName: AuthChallengeName };

export class AuthenticationService {

    public static async login(username: string, password: string): Promise<LoginResponse> {
        return Auth.signIn(username, password);
    }

    public static async signUp(email: string, password: string): Promise<ISignUpResult> {
        return Auth.signUp({username: email, password});
    }

    public static async confirmSignUp(email: string, code: string): Promise<any> {
        return Auth.confirmSignUp(email, code);
    }

    public static async getAccessToken(): Promise<string> {
        return (await Auth.currentSession()).getAccessToken().getJwtToken();
    }

    public static async getCurrentSession(): Promise<CognitoUserSession> {
        return Auth.currentSession();
    }
}
