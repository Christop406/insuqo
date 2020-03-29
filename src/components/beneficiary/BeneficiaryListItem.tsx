import React, { useState, useEffect, useCallback } from 'react';
import { Beneficiary } from '@insuqo/shared/types/application';
import s from './BeneficiaryListItem.module.scss';
import relations from '@insuqo/shared/constants/relations.json';
import EditableLabel from 'components/editable-label/EditableLabel';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface BeneficiaryListItemProps {
    name?: string;
    onClose?: () => any;
    onChange?: (beneficiary: Omit<Beneficiary, 'application'>) => any;
    control?: any;
    register?: any;
    beneficiary: Omit<Beneficiary, 'application'>;
}

const BeneficiaryListItem: React.FC<BeneficiaryListItemProps> = ({ onClose, onChange, beneficiary }) => {

    onChange = useCallback(onChange as any, []);

    const [firstName, setFirstName] = useState(beneficiary.firstName);
    const [middleInitial, setMiddleInitial] = useState(beneficiary.middleInitial);
    const [lastName, setLastName] = useState(beneficiary.lastName);
    const [relationship, setRelationship] = useState(beneficiary.relationship);
    const [percentage, setPercentage] = useState(beneficiary.percentage);
    const [suffix, setSuffix] = useState(beneficiary.suffix);
    const [email, setEmail] = useState(beneficiary.email);

    useEffect(() => {
        onChange && onChange({
            firstName,
            middleInitial,
            lastName,
            percentage,
            relationship,
            suffix,
            email,
        });
    }, [firstName, middleInitial, lastName, percentage, relationship, email, onChange, suffix]);

    useEffect(() => {
        setFirstName(beneficiary.firstName);
        setMiddleInitial(beneficiary.middleInitial);
        setLastName(beneficiary.lastName);
        setRelationship(beneficiary.relationship);
        setPercentage(beneficiary.percentage);
        setSuffix(beneficiary.suffix);
        setEmail(beneficiary.email);
    }, [beneficiary]);

    return (
        <div className={s.container}>
            <button onClick={onClose} type="button" className={cx(s.deleteButton, 'button')}>
                <FontAwesomeIcon icon={['far', 'times-circle']} />
            </button>
            <div className={s.content}>
                <div className={s.personalContainer}>
                    <div className={s.infoContainer}>
                        <div>
                            <div className={s.beneficiaryName}>
                                <EditableLabel
                                    value={firstName}
                                    onChange={setFirstName as any}
                                    placeholder="First" />
                                <EditableLabel
                                    value={middleInitial}
                                    onChange={setMiddleInitial as any}
                                    placeholder="M" />
                                <EditableLabel
                                    value={lastName}
                                    onChange={setLastName as any}
                                    placeholder="Last" />
                            </div>
                            <select placeholder="Relationship" value={relationship} onChange={(e) => setRelationship(e.target.value as any)} className={cx(s.selector, 'select input')}>
                                {relations.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={s.shareContainer}>
                        <EditableLabel
                            value={percentage}
                            onChange={setPercentage as any}
                            className={s.shareLabel}
                            placeholder="20" />%
                    </div>
                </div>
                <div className={s.contactContainer}>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className={cx('input')} />
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryListItem;