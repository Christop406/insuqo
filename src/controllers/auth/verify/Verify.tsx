import React from 'react';

interface VerifyProps {
    onContinue?: () => unknown;
    onResend?: () => unknown;
}

export const Verify: React.FC<VerifyProps> = (props) => {
    return (
        <>
            <h3>Verify your Account</h3>
            <span>We have sent a verification link to you. Please click the link, then continue below.</span>
            <button onClick={props.onContinue}>Continue</button>
            <button onClick={props.onResend}>Resend Code</button>
        </>
    );
};