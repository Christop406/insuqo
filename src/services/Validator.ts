import PasswordValidator from 'password-validator';

export class Validator {
    public static validatePassword(password: string): string[] {
        if(password === '') {
            return ['empty'];
        }
        return this.getPasswordSchema().validate(password, {list: true}) as string[];
    }

    public static validateEmail(email: string): boolean {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(email)
    }

    private static getPasswordSchema(): PasswordValidator {
        return new PasswordValidator()
            .is().min(8)
            .is().max(128)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().symbols();
    }
}
