import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { QuickTermQuoteResult, Application } from '@insuqo/shared';
import s from './BasicInfo.module.scss';
import cx from 'classnames';
import Cleave from 'cleave.js/react';
import countries from 'util/country-by-abbreviation.json';
import states from '@insuqo/shared/constants/states.json';
import 'antd/es/modal/style/css';
import Modal from 'antd/es/modal';
import PaymentFrequency from 'components/application/PaymentFrequency/PaymentFrequency';
import { ZipCode } from '@insuqo/shared/types/zip-code';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BasicInfoProps {
    application: Application;
    chosenQuote: QuickTermQuoteResult;
    location: ZipCode | undefined;
    onSubmit: (application: Application) => any;
    currentUser: firebase.User | undefined;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ application, chosenQuote, onSubmit, location, currentUser }) => {
    application = getDefaultValues(application, currentUser);
    const methods = useForm<Application>({ mode: 'onChange', defaultValues: application });
    const { handleSubmit, register, formState } = methods;
    const { formGroup } = s;
    return (
        <div className={s.container}>
            <div className={s.formContainer}>
                <FormContext {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1>Let's wrap this up.</h1>
                        <h2 className="purpleText">We just need a few more things to get you on your way.</h2>
                        <div className={cx(s.formSection, 'form-row')}>
                            <div className={cx(formGroup, 'col-sm')}>
                                <label htmlFor="firstName">
                                    First Name<span className="text-danger">*</span>
                                </label>
                                <input className="input" type="text" placeholder="First name" name="firstName" ref={register({ required: true, maxLength: 80 })} />
                            </div>
                            <div className={cx(formGroup, 'col-sm')}>
                                <label htmlFor="lastName">
                                    Last Name<span className="text-danger">*</span>
                                </label>
                                <input className="input" type="text" placeholder="Last name" name="lastName" ref={register({ required: true, maxLength: 100 })} />
                            </div>
                        </div>
                        <h3>Citizenship</h3>
                        <div className={cx(s.formSection, 'form-row')}>
                            <div className={cx(formGroup, 'col-sm')}>
                                <label htmlFor="countryOfBirth">
                                    Country of Birth<span className="text-danger">*</span>
                                </label>
                                <select className="input" name="countryOfBirth" ref={register({ required: true })}>
                                    <option value={undefined} disabled key="-1">Select...</option>
                                    {countries.map((option, index) =>
                                        <option key={index}
                                            value={option.abbreviation}>{option.country}</option>
                                    )}
                                </select>
                            </div>
                            <div className={cx(formGroup, 'col-sm')}>
                                <label htmlFor="ssn">
                                    Social Security Number<span className="text-danger">*</span>
                                </label>
                                <Cleave placeholder="123-45-6789"
                                    name="ssn"
                                    disabled={!!application.ssn}
                                    className="input"
                                    htmlRef={register}
                                    options={{
                                        numericOnly: true,
                                        delimiter: '-',
                                        blocks: [3, 2, 4],
                                    }}
                                />
                                {/* {errors.ssn ?
                                    <small id="ssnError" className="text-danger">{errors.ssn}</small> :
                                    <small id="ssnHelp" className="form-text text-muted">We are required to use
                                            this for validation purposes.</small>} */}
                            </div>
                        </div>
                        <h4>Driver's License Info</h4>
                        <div className={cx(s.formSection, 'form-row')}>
                            <div className={cx(formGroup, 'col-sm-4')}>
                                <select className="input" name="idState" ref={register}>
                                    <option key="-1" value={''}>Select...</option>
                                    {states.map((option, index) =>
                                        <option key={index}
                                            value={option.abbreviation}>{option.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className={cx(formGroup, 'col-sm-8')}>
                                <input className="input" type="text" placeholder="License Code/Number" name="idNum" ref={register} />
                            </div>
                        </div>
                        <h3>Address</h3>
                        <div className={cx(s.formSection, 'form-row')}>
                            <div className={cx(formGroup, 'col-sm-8')}>
                                <label htmlFor="line1">
                                    Street Address (Line 1)<span className="text-danger">*</span>
                                </label>
                                <input className="input" type="text" placeholder="635 Main St." name="address.streetAddress" ref={register({ required: true })} />
                            </div>
                            <div className={cx(formGroup, 'col-sm-4')}>
                                <label htmlFor="line2">
                                    Apt/Unit (Line 2)
                                </label>
                                <input className="input" type="text" placeholder="#36B" name="address.unit" ref={register} />
                            </div>
                            <div className={s.formSection}>
                                <div className="d-flex align-items-center w-100 justify-content-end">
                                    <button onClick={showCityReasoning} className="btn purpleText btn-sm btn-link" type="button">
                                        Why can't I change my city?
                                    </button>
                                    <span className="d-block text-muted not-allowed">{location?.cityName},</span>
                                    <span className="d-block text-muted not-allowed">&nbsp;{location?.stateCode}</span>
                                    <span className="d-block text-muted not-allowed">&nbsp;{location?.code}</span>
                                </div>
                            </div>
                        </div>
                        <h3>Contact Info</h3>
                        <div className={cx(s.formSection, 'form-row')}>
                            <div className={cx(formGroup, 'col-sm-7')}>
                                <label htmlFor="primaryEmail">
                                    Primary Email<span className="text-danger">*</span>
                                </label>
                                <input className="input" type="email" placeholder="mike@example.com" name="primaryEmail" ref={register({ required: true, pattern: /.+@.+\..+/i })} />
                            </div>
                            <div className={cx(formGroup, 'col-sm-5')}>
                                <label htmlFor="primaryPhone">
                                    Primary Phone<span className="text-danger">*</span>
                                </label>
                                <input className="input" type="tel" placeholder="Primary Phone" name="primaryPhone" ref={register({ required: true })} />
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <h3>Payment Frequency</h3>
                            <button onClick={showFreqInfo} className="btn purpleText btn-sm btn-link" type="button">
                                Help me choose
                            </button>
                        </div>
                        <div className={cx(s.formSection, 'row')}>
                            <PaymentFrequency
                                monthly={chosenQuote.MonthlyTotalPremium}
                                quarterly={chosenQuote.QuarterlyTotalPremium}
                                semiAnnually={chosenQuote.SemiAnnualTotalPremium}
                                annually={chosenQuote.AnnualTotalPremium} />
                        </div>
                        <div className={s.submitSection}>
                            <button type="submit" disabled={!formState.isValid} className={cx('button primary', s.submitButton)}>
                                Continue
                            </button>
                        </div>
                    </form>
                </FormContext>
            </div>
        </div>
    );
};

const getDefaultValues = (applicationInfo: Application, userInfo: firebase.User | undefined): Application => {
    return {
        ...applicationInfo,
        primaryEmail: applicationInfo.primaryEmail || userInfo?.email || undefined,
    };
};

const showCityReasoning = () => {
    Modal.info({
        title: 'Why can\'t I change my city/state?',
        content: <p>We do not allow you to change your city or state because a change in this information
            may affect your quoted amount.<br /><br />If you would like to change your address, please re-run our
            quoting tool with your correct address.</p>,
        centered: true
    });
};

const showFreqInfo = () => {
    Modal.info({
        title: 'Why the different prices?',
        content: <p>A lot like any other kind of subscription,
        a vendor will reward up-front payment with a discounted rate.
        It is the same for life insurance. If you decide to pay on
        an annual pay schedule, your overall rate will be somewhat lower
            than on a monthly schedule.<br /><br />
            To see the different rates, click each radio button to change your payment frequency.
        </p>,
        centered: true
    });
};

export default BasicInfo;