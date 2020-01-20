import React, { useEffect, useState } from 'react';
import { Application, QuickTermQuoteResult, PremiumMode } from 'insuqo-shared';
import s from './ApplicationReview.module.scss';
import cx from 'classnames';
import { ApplicationService } from '../../../services/application.service';
import { logoImageForCompanyID } from '../../../func';

const applicationService = new ApplicationService();

export const ApplicationReview: React.FC<ApplicationReviewProps> = (props) => {
    const { application } = props;

    const [image1, setImage1] = useState<string>();
    const [image2, setImage2] = useState<string>();

    useEffect(() => {
        if (application) {
            applicationService.getImageUrl(application.id, application.images![0]).then((img) => {
                setImage1(img);
            });
            applicationService.getImageUrl(application.id, application.images![1]).then((img) => {
                setImage2(img);
            });
        }
    }, [application]);

    if (!application) {
        return <></>;
    }

    const chosenQuote = application.quotes?.find((q) => q.id === application.quoteId && q.RecID === application.quoteRecId);

    // console.log(image1, image2);
    return (
        <div className={s.container}>
            <div className={s.reviewContainer}>
                <h1>Please review your application</h1>
                <div className={s.reviewSection}>
                    <h2>Chosen Quote</h2>
                    <div className={s.quoteContainer}>
                        <div className={s.companyImage}>
                            <img src={logoImageForCompanyID(chosenQuote?.CompanyID)} />
                        </div>
                        <div>
                            <p className={s.field}><span className={s.label}>Company</span> {chosenQuote?.CompanyName}</p>
                            <p className={s.field}><span className={s.label}>Product</span> {chosenQuote?.ProductName}</p>
                            <p className={s.field}><span className={s.label}>Coverage</span> {chosenQuote?.FaceAmount}</p>
                            <p className={s.field}><span className={s.label}>Term</span> {chosenQuote?.GuaranteedTerm}</p>
                            <p className={s.field}><span className={s.label}>Payment</span> ${getQuotePrice(chosenQuote!, application.paymentFrequency)}</p>
                        </div>
                    </div>
                    <div className={s.fieldRow}>
                        <p className={s.field}><span className={s.label}>Quote ID</span> {application.quoteId}</p>
                        <p className={s.field}><span className={s.label}>Quote RecID</span> {application.quoteRecId}</p>
                    </div>
                </div>
                <div className={s.reviewSection}>
                    <h2>Personal Information</h2>
                    <div className={s.fieldRow}>
                        <p className={s.field}><span className={s.label}>First Name</span> {application.firstName}</p>
                        {application.middleInitial && <p className={s.field}><span className={s.label}>Middle Initial</span> {application.middleInitial}</p>}
                        <p className={s.field}><span className={s.label}>Last Name</span> {application.lastName}</p>
                    </div>
                    <div className={s.fieldRow}>
                        <p className={s.field}><span className={s.label}>Date of Birth</span> {application.birthDate?.substring(0, 10)}</p>
                        <p className={s.field}><span className={s.label}>Birth Country</span> {application.countryOfBirth}</p>
                    </div>
                </div>
                {application.idNum && application.idState &&
                    <div className={s.reviewSection}>
                        <h2>Identification Card Information</h2>
                        <div className={s.fieldRow}>
                            <p className={s.field}><span className={s.label}>ID Number</span> {application.idNum}</p>
                            <p className={s.field}><span className={s.label}>ID State</span> {application.idState?.toUpperCase()}</p>
                        </div>
                    </div>
                }
                <div className={s.reviewSection}>
                    <h2>Contact Information</h2>
                    <div className={s.addressContainer}>
                        <div className={s.field}>
                            <div className={s.label}>Address</div>
                            <p>{application.address?.line1} {application.address?.appt}</p>
                            {application.address?.line2 && <p>{application.address?.line2} (Line 2)</p>}
                            {application.address?.line3 && <p>{application.address?.line3} (Line 3)</p>}
                            <p>{application.address?.city}, {application.address?.state} {application.address?.zipCode}</p>
                        </div>
                        <br />
                    </div>
                    <p className={s.field}><span className={s.label}>Primary Email</span> {application.primaryEmail}</p>
                    {application.otherEmail && <p>Secondary Email: {application.otherEmail}</p>}
                    <p className={s.field}><span className={s.label}>Primary Phone</span> {application.primaryPhone}</p>
                    {application.otherPhone && <p>Secondary Phone: {application.otherPhone}</p>}
                </div>
                <div className={s.reviewSection}>
                    <h2>Beneficiaries</h2>
                    {application.beneficiaries?.map((b, i) => (
                        <div className={s.beneficiaryItem}>
                            <h5>Beneficiary {i + 1}</h5>
                            <div className={s.fieldRow}>
                                <p className={s.field}><span className={s.label}>First Name</span> {b.firstName}</p>
                                {b.middleInitial && <p className={s.field}><span className={s.label}>Middle Initial</span> {b.middleInitial}</p>}
                                <p className={s.field}><span className={s.label}>Last Name</span> {b.lastName}</p>
                                {b.suffix && <p className={s.field}><span className={s.label}>Suffix</span> {b.suffix}</p>}
                                <p className={s.field}><span className={s.label}>Relationship</span> {b.relationship}</p>
                                <p className={s.field}><span className={s.label}>Share</span> {b.percentage}%</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={s.reviewSection}>
                    <h2>Payment Information</h2>
                    <div className={s.fieldRow}>
                        <p className={s.field}><span className={s.label}>Name on Account</span> {application.nameOnAccount}</p>
                        <p className={s.field}><span className={s.label}>Account Number</span> <span className="code">{application.accountNumber}</span></p>
                        <p className={s.field}><span className={s.label}>Routing Number</span> <span className="code">{application.routingNumber}</span></p>
                    </div>
                    <img className={s.paymentImage} src={image1}></img>
                    <img className={s.paymentImage} src={image2}></img>
                </div>
                <div className={s.reviewSection}>
                    <h2>Other Plan Options</h2>
                    <p className={s.field}><span className={s.label}>Payment Frequency</span> {application.paymentFrequency?.toUpperCase()}</p>
                    <div className={s.fieldRow}>
                        <BooleanDisplay value={application.hasIntendedParty} label={'Intended Party'} />
                        <BooleanDisplay value={application.otherLifeInsurance} label={'Other Life Insurance'} />
                        <BooleanDisplay value={application.otherInsuranceModified} label={'Other Insurance Modified'} />
                        <BooleanDisplay value={application.otherInsurancePending} label={'Other Insurance Pending'} />
                        <BooleanDisplay value={application.otherInsuranceWillReplace} label={'Other Insurance Will Replace'} />
                        <BooleanDisplay value={application.willFinance} label={'Will Finance'} />
                        <BooleanDisplay value={application.willLiquidate} label={'Will Liquidate'} />
                    </div>
                    {application.referrer && <p className={s.field}><span className={s.label}>Referred By</span> {application.referrer}</p>}
                </div>
                {/* <div className={s.reviewSection}>
                    <h2>Application Info</h2>
                    <p>Creation: {application.creation}</p>
                    <p>ID: {application.id}</p>
                    <p>Status: {application.status}</p>
                    <p>Updated: {application.updateTime}</p>
                    <p>Owner: {application.userId}</p>
                </div> */}
            </div>
            <div className={s.actionButtonContainer}>
                <button onClick={() => applicationService.submitApplication(application.id)} className="primary button">Submit</button>
            </div>
        </div>
    );
};

const getQuotePrice = (quote: QuickTermQuoteResult, paymentFrequency?: PremiumMode): string => {
    let quotePrice: string;
    switch (paymentFrequency) {
        case PremiumMode.ANNUAL:
            quotePrice = quote.AnnualTotalPremium;
            break;
        case PremiumMode.SEMI_ANNUALLY:
            quotePrice = quote.SemiAnnualTotalPremium;
            break;
        case PremiumMode.QUARTERLY:
            quotePrice = quote.QuarterlyTotalPremium;
            break;
        case PremiumMode.MONTHLY:
        default:
            quotePrice = quote.MonthlyTotalPremium;
    }
    return (+quotePrice).toFixed(2);
};

interface ApplicationReviewProps {
    application?: Application;
    onSubmit: (application: Application) => any;
}

const BooleanDisplay: React.FC<BooleanDisplayProps> = (props) => {
    return (
        <p className={cx(s.field, !props.value ? s.disabled : undefined)}>
            {props.label}
        </p>
    );
};

interface BooleanDisplayProps {
    value: boolean | undefined;
    label: string;
}