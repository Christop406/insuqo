import React from 'react';
import s from './PasswordSecurity.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import '../../style/transitions.scss';

interface PasswordSecurityProps {
    valid?: boolean;
    requirements?: string[];
}

export const PasswordSecurity: React.FunctionComponent<PasswordSecurityProps> = ({ requirements, valid }) => {

    let min = true;
    let max = true;
    let uppercase = true;
    let lowercase = true;
    let digits = true;
    let symbols = true;
    if (requirements) {
        requirements.forEach((req: string) => {
            switch (req) {
                case 'min':
                    min = false;
                    break;
                case 'max':
                    max = false;
                    break;
                case 'uppercase':
                    uppercase = false;
                    break;
                case 'lowercase':
                    lowercase = false;
                    break;
                case 'digits':
                    digits = false;
                    break;
                case 'symbols':
                    symbols = false;
                    break;
            }
        });
    }

    return (
        <div className={cx(s['password-security'])}>
            <div>Password Requirements</div>
            <div><CompleteIcon complete={min || valid} />At least 8 characters</div>
            {!max && <div><CompleteIcon complete={max || valid} />Less than 128 characters</div>}
            <div><CompleteIcon complete={uppercase || valid} />At least one uppercase character</div>
            <div><CompleteIcon complete={lowercase || valid} />At least one lowercase character</div>
            <div><CompleteIcon complete={digits || valid} />At least one number</div>
            <div><CompleteIcon complete={symbols || valid} />At least one symbol</div>
            {/*{JSON.stringify(props.requirements)}*/}
        </div>

    );
};

const CompleteIcon: React.FunctionComponent<{ complete?: boolean }> = ({ complete }) => {
    return <FontAwesomeIcon className={s['completion-icon']} color={complete ? '#48A9A6' : '#C1666B'}
        icon={['far', complete ? 'check-circle' : 'times-circle']} />;
};
