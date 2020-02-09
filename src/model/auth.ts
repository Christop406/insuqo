export enum FirebaseError {
    EmailAlreadyInUse = 'auth/email-already-in-use',
    InvalidEmail = 'auth/invalid-email',
    OperationNotAllowed = 'auth/operation-not-allowed',
    UserDisabled = 'auth/user-disabled',
    UserNotFound = 'auth/user-not-found',
    WeakPassword = 'auth/weak-password',
    WrongPassword = 'auth/wrong-password',
    ExpiredActionCode = 'auth/expired-action-code',
}