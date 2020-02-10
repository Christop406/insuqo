import firebaseConfig from '../config/firebase';
declare type AuthType = import('firebase').auth.Auth;
declare type UserType = import('firebase').User;
declare type AuthSettingsType = firebase.auth.AuthSettings;
declare type OverriddenFeatures = 'app' | 'currentUser' | 'tenantId' | 'languageCode' | 'settings' | 'isSignInWithEmailLink' | 'onAuthStateChanged' | 'onIdTokenChanged';

export class AuthClass implements Omit<AuthType, OverriddenFeatures> {

    private auth?: AuthType;

    private async getClient(): Promise<AuthType> {
        if (!this.auth) {
            const firebase = await import(/* webpackChunkName: "firebase" */ 'firebase/app');
            await import(/* webpackChunkName: "firebaseAuth" */ 'firebase/auth');
            firebase.initializeApp(firebaseConfig);
            this.auth = firebase.auth();
        }
        return this.auth;
    }

    public async getTenantId(): Promise<string | undefined> {
        return (await this.getClient()).tenantId || undefined;
    }

    public async getCurrentUser(): Promise<UserType | undefined> {
        return (await this.getClient()).currentUser || undefined;
    }

    public async getLanguageCode(): Promise<string | undefined> {
        return (await this.getClient()).languageCode || undefined;
    }

    public async getSettings(): Promise<AuthSettingsType> {
        return (await this.getClient()).settings;
    }

    public async applyActionCode(code: string): Promise<void> {
        return (await this.getClient()).applyActionCode(code);
    }
    public async checkActionCode(code: string): Promise<firebase.auth.ActionCodeInfo> {
        return (await this.getClient()).checkActionCode(code);
    }
    public async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
        return (await this.getClient()).confirmPasswordReset(code, newPassword);
    }
    public async createUserWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).createUserWithEmailAndPassword(email, password);
    }
    public async fetchSignInMethodsForEmail(email: string): Promise<string[]> {
        return (await this.getClient()).fetchSignInMethodsForEmail(email);
    }
    public async isSignInWithEmailLink(emailLink: string): Promise<boolean> {
        return (await this.getClient()).isSignInWithEmailLink(emailLink);
    }
    public async getRedirectResult(): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).getRedirectResult();
    }
    public async onAuthStateChanged(nextOrObserver: firebase.Observer<any, Error> | ((a: firebase.User | null) => any), error?: ((a: firebase.auth.Error) => any) | undefined, completed?: firebase.Unsubscribe | undefined): Promise<firebase.Unsubscribe> {
        return (await this.getClient()).onAuthStateChanged(nextOrObserver, error, completed);
    }
    public async onIdTokenChanged(nextOrObserver: firebase.Observer<any, Error> | ((a: firebase.User | null) => any), error?: ((a: firebase.auth.Error) => any) | undefined, completed?: firebase.Unsubscribe | undefined): Promise<firebase.Unsubscribe> {
        return (await this.getClient()).onIdTokenChanged(nextOrObserver, error, completed);
    }
    public async sendSignInLinkToEmail(email: string, actionCodeSettings: firebase.auth.ActionCodeSettings): Promise<void> {
        return (await this.getClient()).sendSignInLinkToEmail(email, actionCodeSettings);
    }
    public async sendPasswordResetEmail(email: string, actionCodeSettings?: firebase.auth.ActionCodeSettings | null | undefined): Promise<void> {
        return (await this.getClient()).sendPasswordResetEmail(email, actionCodeSettings);
    }
    public async setPersistence(persistence: string): Promise<void> {
        return (await this.getClient()).setPersistence(persistence);
    }
    public async signInAndRetrieveDataWithCredential(credential: firebase.auth.AuthCredential): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).signInAndRetrieveDataWithCredential(credential);
    }
    public async signInAnonymously(): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).signInAnonymously();
    }
    public async signInWithCredential(credential: firebase.auth.AuthCredential): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).signInWithCredential(credential);
    }
    public async signInWithCustomToken(token: string): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).signInWithCustomToken(token);
    }
    public async signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).signInWithEmailAndPassword(email, password);
    }
    public async signInWithPhoneNumber(phoneNumber: string, applicationVerifier: firebase.auth.ApplicationVerifier): Promise<firebase.auth.ConfirmationResult> {
        return (await this.getClient()).signInWithPhoneNumber(phoneNumber, applicationVerifier);
    }
    public async signInWithEmailLink(email: string, emailLink?: string | undefined): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).signInWithEmailLink(email, emailLink);
    }
    public async signInWithPopup(provider: firebase.auth.AuthProvider): Promise<firebase.auth.UserCredential> {
        return (await this.getClient()).signInWithPopup(provider);
    }
    public async signInWithRedirect(provider: firebase.auth.AuthProvider): Promise<void> {
        return (await this.getClient()).signInWithRedirect(provider);
    }
    public async signOut(): Promise<void> {
        return (await this.getClient()).signOut();
    }
    public async updateCurrentUser(user: firebase.User | null): Promise<void> {
        return (await this.getClient()).updateCurrentUser(user);
    }
    public async useDeviceLanguage(): Promise<void> {
        return (await this.getClient()).useDeviceLanguage();
    }
    public async verifyPasswordResetCode(code: string): Promise<string> {
        return (await this.getClient()).verifyPasswordResetCode(code);
    }
}

const authInstance = new AuthClass();

export const Auth = authInstance;