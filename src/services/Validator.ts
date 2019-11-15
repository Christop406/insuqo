import PasswordValidator from 'password-validator';

export class Validator {
    public static validatePassword(password: string): string[] {
        return this.getPasswordSchema().validate(password, {list: true}) as string[];
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
