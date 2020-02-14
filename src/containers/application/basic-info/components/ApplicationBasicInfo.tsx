import React from 'react';
import { Field, Formik } from 'formik';
import s from './ApplicationBasicInfo.module.scss';
import { Application, Beneficiary, PremiumMode, QuickTermQuoteResult } from '@insuqo/shared';
import Modal from 'antd/es/modal';
import 'antd/es/modal/style/css';
import cx from 'classnames';
import { Validator } from 'services/Validator';
import { Logger } from 'services/logger';

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

    // let beneficiaries: Beneficiary[] = app.beneficiaries || [];

    return (
        <Formik validate={validateApplication}
            validateOnBlur={false}
            validateOnMount={false}
            validateOnChange={false}
            initialValues={getInitialValues(app)}
            onSubmit={(values): any => props.onSubmit({ ...values } as any)}>
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
                            <div className={cx(s['plan-info-group'], s['form-section'])}>
                                <h2>Plan Info</h2>
                                {/* <div className={s['beneficiaries-group']}>
                                    <h3>Beneficiaries</h3>
                                    <h4 className="text-muted">Who is covered if the plan goes into effect?</h4>
                                    <BeneficiaryList initialValue={beneficiaries} onUpdate={(bens) => beneficiaries = bens} />
                                </div> */}
                                <div className={cx(s['other-info-group'], s['form-section'])}>
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
                            <div className={s.submitSection}>
                                <button type="submit" disabled={isSubmitting} className={cx('button primary', s.submitButton)}>
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

export default ApplicationBasicInfo;