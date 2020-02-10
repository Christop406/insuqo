import React from 'react';
import { Field, Formik } from 'formik';
import s from './ApplicationBasicInfo.module.scss';
import countries from '../../../util/country-by-abbreviation.json';
import states from '@insuqo/shared/constants/states.json';
import Cleave from 'cleave.js/react';
import { Application, Beneficiary, PremiumMode, QuickTermQuoteResult } from '@insuqo/shared';
import Modal from 'antd/es/modal';
import 'antd/es/modal/style/css';
import BeneficiaryList from '../../beneficiary-list/BeneficiaryList';
import cx from 'classnames';
import { Validator } from '../../../services/Validator';
import { Logger } from '../../../services/logger';

interface ApplicationBasicInfoProps {
    application: Application;
    chosenQuote?: QuickTermQuoteResult;
    onSubmit: (application: Application & { beneficiaries: Beneficiary[] }) => any;
}

const ApplicationBasicInfo: React.FunctionComponent<ApplicationBasicInfoProps> = (props) => {
    const app = props.application;
    let ssnAlreadyFilled = false;
    if (!app) {
        return <></>;
    } else if (app.ssn) {
        ssnAlreadyFilled = true;
    }

    Logger.debug(app);

    let beneficiaries: Beneficiary[] = app.beneficiaries || [];

    return (
        <Formik validate={validateApplication}
            validateOnBlur={false}
            validateOnMount={false}
            validateOnChange={false}
            initialValues={getInitialValues(app)}
            onSubmit={(values): any => props.onSubmit({ ...values, beneficiaries } as any)}>
            {({
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
            }): JSX.Element =>
                <div className={s.container}>
                    <div className={s['form-container']}>
                        <form onSubmit={handleSubmit}>
                            <h1>Let's wrap this up.</h1>
                            <h2 className="purpleText">We just need a few more things to get you on your way.</h2>
                            <div className={cx(s['personal-group'], s['form-section'])}>
                                <h3>Personal Info</h3>
                                <div className="form-row">
                                    <div className="col-sm">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name<span className="text-danger">*</span></label>
                                            <input onChange={handleChange} onBlur={handleBlur}
                                                value={values.firstName}
                                                name="firstName" className="input" placeholder="John" />
                                            {errors.firstName &&
                                                <small id="firstNameError"
                                                    className="text-danger">{errors.firstName}</small>}
                                        </div>
                                    </div>
                                    <div className="col-sm">
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name<span
                                                className="text-danger">*</span></label>
                                            <input onChange={handleChange} onBlur={handleBlur}
                                                value={values.lastName}
                                                name="lastName" className="input" placeholder="Smith" />
                                            {errors.lastName &&
                                                <small id="lastNameError"
                                                    className="text-danger">{errors.lastName}</small>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx(s['citizenship-group'], s['form-section'])}>
                                <h3>Citizenship</h3>
                                <div className="form-group">
                                    <label htmlFor="countryOfBirth">Country of Birth<span
                                        className="text-danger">*</span></label>
                                    <select className="input select"
                                        name="countryOfBirth"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.countryOfBirth}
                                        defaultValue={'US'}
                                        placeholder="United States"
                                    >
                                        <option value={undefined} disabled key="-1">Select...</option>
                                        {countries.map((option, index) =>
                                            <option key={index}
                                                value={option.abbreviation}>{option.country}</option>
                                        )}
                                    </select>
                                    {errors.countryOfBirth &&
                                        <small className="text-danger">{errors.countryOfBirth}</small>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ssn">Social Security Number<span
                                        className="text-danger">*</span></label>
                                    <Cleave placeholder="123-45-6789"
                                        name="ssn"
                                        disabled={ssnAlreadyFilled}
                                        className="input"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.ssn}
                                        options={{
                                            numericOnly: !ssnAlreadyFilled,
                                            delimiter: '-',
                                            blocks: [3, 2, 4],
                                        }}
                                    />
                                    {errors.ssn ?
                                        <small id="ssnError" className="text-danger">{errors.ssn}</small> :
                                        <small id="ssnHelp" className="form-text text-muted">We are required to use
                                            this for validation purposes.</small>}
                                </div>
                                <div className={s['license-group']}>
                                    <h4>Driver's License Info</h4>
                                    <div className="form-row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="idState">Registered State</label>
                                                <select className="input select" value={values.idState}
                                                    defaultValue={undefined}
                                                    name="idState"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <option key="-1" value={''}>Select...</option>
                                                    {states.map((option, index) =>
                                                        <option key={index}
                                                            value={option.abbreviation}>{option.name}</option>
                                                    )}
                                                </select>
                                                {errors.idState &&
                                                    <small id="idStateError"
                                                        className="text-danger">{errors.idState}</small>}
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="dlNum">License Code/Number</label>
                                                <Cleave
                                                    name="idNum"
                                                    className="input"
                                                    options={{
                                                        blocks: [8],
                                                        numericOnly: false,
                                                        uppercase: true
                                                    }}
                                                    value={values.idNum}
                                                    onChange={handleChange}
                                                    placeholder="F870684" />
                                                {errors.idNum &&
                                                    <small id="idNumError"
                                                        className="text-danger">{errors.idNum}</small>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx(s['address-group'], s['form-section'])}>
                                <h3>Address</h3>
                                <div className="form-row">
                                    <div className="col-sm">
                                        <div className="form-group">
                                            <label htmlFor="address.line1">Street Address (Line 1)<span
                                                className="text-danger">*</span></label>
                                            <Field className="input"
                                                placeholder="100 Example Ave"
                                                name="address.line1"
                                                value={values.address?.line1}
                                                onChange={handleChange}
                                                onBlur={handleBlur} />
                                            {errors?.address &&
                                                <small id="address.line1"
                                                    className="text-danger">{errors.address}</small>}
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="addrLine2">Apartment/Unit (Line 2)</label>
                                            <input className="input"
                                                name="addrLine2"
                                                placeholder="18B"
                                                value={values.address?.line2}
                                                onChange={handleChange}
                                                onBlur={handleBlur} />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center w-100 justify-content-end">
                                    <button onClick={showCityReasoning} className="btn purpleText btn-sm btn-link"
                                        type="button">Why can't I change my city?
                                    </button>
                                    <span className="d-block text-muted not-allowed">{values.address?.city},</span>
                                    <span className="d-block text-muted not-allowed">&nbsp;{values.address?.state}</span>
                                    <span className="d-block text-muted not-allowed">&nbsp;{values.address?.zipCode}</span>
                                </div>
                            </div>
                            <div className={cx(s['contact-info-group'], s['form-section'])}>
                                <h3>Contact Info</h3>
                                <div className="form-group">
                                    <label htmlFor="primaryEmail">Primary Email<span
                                        className="text-danger">*</span></label>
                                    <input className="input"
                                        name="primaryEmail"
                                        type="email"
                                        placeholder="mike@example.com"
                                        value={values.primaryEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur} />
                                    {errors.primaryEmail &&
                                        <small id="primaryEmailError"
                                            className="text-danger">{errors.primaryEmail}</small>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="primaryPhone">Primary Phone<span
                                        className="text-danger">*</span></label>
                                    <Field name="primaryPhone"
                                        className="input"
                                        type="tel"
                                        placeholder="(123) 456-7890"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.primaryPhone}
                                    />
                                    {errors.primaryPhone &&
                                        <small id="primaryPhoneError"
                                            className="text-danger">{errors.primaryPhone}</small>}
                                </div>
                            </div>
                            <div className={cx(s['plan-info-group'], s['form-section'])}>
                                <h2>Plan Info</h2>
                                <div className={s['beneficiaries-group']}>
                                    <h3>Beneficiaries</h3>
                                    <h4 className="text-muted">Who is covered if the plan goes into effect?</h4>
                                    <BeneficiaryList initialValue={beneficiaries} onUpdate={(bens) => beneficiaries = bens} />
                                </div>
                                <div className={cx(s['payment-freq-group'], s['form-section'])}>
                                    <div className="d-flex align-items-center">
                                        <h3>Payment Frequency</h3>
                                        <button onClick={showFreqInfo} className="btn purpleText btn-sm btn-link"
                                            type="button">Help me choose
                                        </button>
                                    </div>
                                    <div className="row">
                                        <div
                                            className={cx('col d-flex flex-column justify-content-between', s['radio-group'])}>
                                            <div className="form-check">
                                                <Field type="radio" id="freq-month" className="form-check-input"
                                                    name="paymentFrequency"
                                                    value={PremiumMode.MONTHLY} />
                                                <label className="form-check-label"
                                                    htmlFor="freq-month">Monthly</label>
                                            </div>
                                            <div className="form-check">
                                                <Field type="radio" id="freq-quarter" className="form-check-input"
                                                    name="paymentFrequency"
                                                    value={PremiumMode.QUARTERLY} />
                                                <label className="form-check-label"
                                                    htmlFor="freq-quarter">Quarterly</label>
                                            </div>
                                            <div className="form-check">
                                                <Field type="radio" id="freq-semi" className="form-check-input"
                                                    name="paymentFrequency"
                                                    value={PremiumMode.SEMI_ANNUALLY} />
                                                <label className="form-check-label"
                                                    htmlFor="freq-semi">Semi-Annually</label>
                                            </div>
                                            <div className="form-check">
                                                <Field type="radio" id="freq-annual" className="form-check-input"
                                                    name="paymentFrequency"
                                                    value={PremiumMode.ANNUAL} />
                                                <label className="form-check-label"
                                                    htmlFor="freq-annual">Annually</label>
                                            </div>
                                        </div>
                                        <div className={cx('col', s['frequency-display'])}>
                                            <span
                                                className={cx('purpleText', s['price-label'])}>${getPaymentByTerm(values.paymentFrequency!, props.chosenQuote)}</span>
                                            <span
                                                className="d-block purpleText">every <b>{getPaymentTerm(values.paymentFrequency!)}</b></span>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx(s['other-info-group'], s['form-section'])}>
                                    <h3>Other Information</h3>
                                    <span className="d-block">Please select any of the following options <b>only</b> if they apply to you.</span>
                                    <div className="form-check">
                                        <Field type="checkbox" checked={values.otherLifeInsurance}
                                            className="form-check-input" id="cb-oli" name="otherLifeInsurance" />
                                        <label className="form-check-label" htmlFor="cb-oli">I currently have
                                            another life insurance plan.</label>
                                    </div>
                                    <div className="form-check">
                                        <Field type="checkbox" checked={values.otherInsuranceWillReplace}
                                            className="form-check-input" id="cb-owr" name="otherInsuranceWillReplace" />
                                        <label className="form-check-label" htmlFor="cb-owr">This policy will
                                            replace or change my other policy.</label>
                                    </div>
                                    <div className="form-check">
                                        <Field type="checkbox" checked={values.otherInsurancePending}
                                            className="form-check-input" id="cb-oip" name="otherInsurancePending" />
                                        <label className="form-check-label" htmlFor="cb-oip">I currently have
                                            another application pending with another insurance company.</label>
                                    </div>
                                    <div className="form-check">
                                        <Field type="checkbox" checked={values.otherInsuranceModified}
                                            className="form-check-input" id="cb-oim" name="otherInsuranceModified" />
                                        <label className="form-check-label" htmlFor="cb-oim">A previous application
                                            has been declined, postponed, or modified after applying.</label>
                                    </div>
                                    <div className="form-check">
                                        <Field type="checkbox" checked={values.hasIntendedParty}
                                            className="form-check-input" id="cb-itp" name="hasIntendedParty" />
                                        <label className="form-check-label" htmlFor="cb-itp">Another party, besides
                                            me, will obtain a right, title, or interest in any policy issued on the
                                            life of the proposed insured as a result of this application.</label>
                                    </div>
                                    <div className="form-check">
                                        <Field type="checkbox" checked={values.willFinance}
                                            className="form-check-input" id="cb-wf" name="willFinance" />
                                        <label className="form-check-label" htmlFor="cb-wf">I will be taking out a
                                            loan or financing my premiums for this plan.</label>
                                    </div>
                                    <div className="form-check">
                                        <Field type="checkbox" checked={values.willLiquidate}
                                            className="form-check-input" id="cb-wl" name="willLiquidate" />
                                        <label className="form-check-label" htmlFor="cb-wl">This policy will be
                                            replaced through a 1035 exchange or liquidation.</label>
                                    </div>
                                </div>
                            </div>
                            <div className={s['submit-section']}>
                                <button type="submit" disabled={isSubmitting} className="button primary">
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </Formik>
    );
};

const getInitialValues = (a: Application): Partial<Application> => {
    return {
        firstName: a.firstName || '',
        lastName: a.lastName || '',
        countryOfBirth: a.countryOfBirth || 'US',
        ssn: a.ssn || '',
        idState: a.idState || undefined,
        idNum: a.idNum || undefined,
        address: a.address || {
            line1: '',
            line2: '',
            line3: '',
            appt: '',
            city: '',
            state: '',
            zipCode: '',
        },
        primaryEmail: a.primaryEmail || '',
        primaryPhone: a.primaryPhone || '',
        otherEmail: a.otherEmail || '',
        otherPhone: a.otherPhone || '',
        paymentFrequency: a.paymentFrequency || PremiumMode.MONTHLY,
        otherLifeInsurance: a.otherLifeInsurance || false,
        otherInsuranceWillReplace: a.otherInsuranceWillReplace || false,
        otherInsurancePending: a.otherInsurancePending || false,
        otherInsuranceModified: a.otherInsuranceModified || false,
        hasIntendedParty: a.hasIntendedParty || false,
        willFinance: a.willFinance || false,
        willLiquidate: a.willLiquidate || false,
    };
};

const validateApplication = (values: Partial<Application>) => {
    const errors: typeof values | any = {};

    if (!values.firstName || values.firstName.length < 2) {
        errors.firstName = 'First name must be 2 characters or longer.';
    }
    if (!values.lastName || values.lastName.length < 2) {
        errors.lastName = 'Last name must be 2 characters or longer.';
    }
    if (!values.countryOfBirth) {
        errors.countryOfBirth = 'Please choose a country.';
    }
    if (!values.ssn || values.ssn.replace(/-/g, '').length < 9) {
        errors.ssn = 'Please enter a valid social security number.';
    }
    Logger.debug(values.idState, values.idNum);
    if (values.idState && !values.idNum) {
        errors.idNum = 'ID number must be specified if state is specified.';
    }
    if (!values.idState && values.idNum) {
        errors.idState = 'ID state must be specified if number is specified';
    }

    if (!values.primaryEmail || !Validator.validateEmail(values.primaryEmail)) {
        errors.primaryEmail = 'Please enter a valid email address';
    }

    Logger.debug(errors, values);

    return errors;
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

const getPaymentByTerm = (freq: PremiumMode, quote?: QuickTermQuoteResult) => {
    if (quote === undefined) return '';

    switch (freq) {
        case PremiumMode.QUARTERLY:
            return parseFloat(quote.QuarterlyTotalPremium).toFixed(2);
        case PremiumMode.SEMI_ANNUALLY:
            return parseFloat(quote.SemiAnnualTotalPremium).toFixed(2);
        case PremiumMode.ANNUAL:
            return parseFloat(quote.AnnualTotalPremium).toFixed(2);
        case PremiumMode.MONTHLY:
        default:
            return parseFloat(quote.MonthlyTotalPremium).toFixed(2);
    }
};

const getPaymentTerm = (freq: PremiumMode) => {
    switch (freq) {
        case PremiumMode.QUARTERLY:
            return '3 months';
        case PremiumMode.SEMI_ANNUALLY:
            return '6 months';
        case PremiumMode.ANNUAL:
            return '12 months';
        case PremiumMode.MONTHLY:
        default:
            return 'month';
    }
};

export default ApplicationBasicInfo;