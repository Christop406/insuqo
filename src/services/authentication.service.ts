import {Auth} from 'aws-amplify';
import {CognitoUser} from "amazon-cognito-identity-js";
import {AuthChallengeName} from "insuqo-shared/types/auth-challenge-name";

declare type LoginResponse = CognitoUser & { challengeName: AuthChallengeName };

export class AuthenticationService {

    public static async login(username: string, password: string): Promise<LoginResponse> {
        return Auth.signIn(username, password);
    }

    public static async getAccessToken(): Promise<string> {
        return (await Auth.currentSession()).getAccessToken().getJwtToken();
    }
}
