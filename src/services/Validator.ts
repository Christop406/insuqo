import PasswordValidator from 'password-validator';

export class Validator {

    private static emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    public static validatePassword(password: string): string[] {
        if(password === '') {
            return ['empty'];
        }
        return this.getPasswordSchema().validate(password, {list: true}) as string[];
    }

    public static isValidPassword(password: string): boolean {
        return Validator.validatePassword(password).length === 0;
    }

    public static validateEmail(email: string): boolean {
        return Validator.emailRegex.test(email);
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
