import React, { useState, useEffect } from 'react';
import { Beneficiary } from '@insuqo/shared/types/application';
import s from './BeneficiaryListItem.module.scss';
import relations from '@insuqo/shared/constants/relations.json';
import EditableLabel from 'components/editable-label/EditableLabel';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface BeneficiaryListItemProps {
    name?: string;
    onClose?: () => any;
    onChange?: (beneficiary: Beneficiary) => any;
    control?: any;
    register?: any;
    beneficiary: Beneficiary;
}

const BeneficiaryListItem: React.FC<BeneficiaryListItemProps> = ({ onClose, onChange, beneficiary }) => {

    const [firstName, setFirstName] = useState(beneficiary.firstName);
    const [middleInitial, setMiddleInitial] = useState(beneficiary.middleInitial);
    const [lastName, setLastName] = useState(beneficiary.lastName);
    const [relationship, setRelationship] = useState(beneficiary.relationship);
    const [percentage, setPercentage] = useState(beneficiary.percentage);
    const [suffix, setSuffix] = useState(beneficiary.suffix);

    useEffect(() => {
        onChange && onChange({
            firstName,
            middleInitial,
            lastName,
            percentage,
            relationship,
            suffix
        });
    }, [firstName, middleInitial, lastName, percentage, relationship]);

    useEffect(() => {
        setFirstName(beneficiary.firstName);
        setMiddleInitial(beneficiary.middleInitial);
        setLastName(beneficiary.lastName);
        setRelationship(beneficiary.relationship);
        setPercentage(beneficiary.percentage);
        setSuffix(beneficiary.suffix);
    }, [beneficiary]);

    return (
        <div className={s.container}>
            <div className={s.infoContainer}>
                <button onClick={onClose} type="button" className={cx(s.deleteButton, 'button')}>
                    <FontAwesomeIcon icon={['far', 'times-circle']} />
                </button>
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
                    <select placeholder="Relationship" value={relationship} onChange={setRelationship as any} className={cx(s.selector, 'select input')}>
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
    );
};

export default BeneficiaryListItem;