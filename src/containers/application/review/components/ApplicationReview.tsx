import React from 'react';
import { Application, QuickTermQuoteResult, PremiumMode, Quote } from '@insuqo/shared';
import s from './ApplicationReview.module.scss';
import cx from 'classnames';
import { logoImageForCompanyID, formatCovAmount } from '../../../../func';
import { Beneficiary } from 'model/beneficiary';
import { Optional } from 'components/base/Optional';
import { ZipCode } from '@insuqo/shared/types/zip-code';

// const applicationService = new ApplicationService();

const ApplicationReview: React.FC<ApplicationReviewProps> = (props) => {
    const { application, quotes, beneficiaries, checkImages, quote, location } = props;
    let { chosenQuote } = props;

    // const [image1, setImage1] = useState<string>();
    // const [image2, setImage2] = useState<string>();

    if (!application) {
        return <></>;
    }

    chosenQuote = chosenQuote || quotes?.find((q) => q.id === application.quoteId && q.RecID === application.quoteRecId);

    const submitApplication = async () => {
        props.onSubmit(application);
    };

    return (
        <div className={s.container}>
            <div className={s.reviewContainer}>
                <h1>Please review your application</h1>
                <div className={s.reviewSection}>
                    <h2>Chosen Quote</h2>
                    <div className={s.quoteContainer}>
                        <div className={s.companyImage}>
                            <img alt={`Logo for ${chosenQuote?.CompanyName}`} src={logoImageForCompanyID(chosenQuote?.CompanyID)} />
                        </div>
                        <div>
                            <p className={s.field}><span className={s.label}>Company</span> {chosenQuote?.CompanyName}</p>
                            <p className={s.field}><span className={s.label}>Product</span> {chosenQuote?.ProductName}</p>
                            <p className={s.field}><span className={s.label}>Coverage</span> ${formatCovAmount(chosenQuote?.FaceAmount)}</p>
                            <p className={s.field}><span className={s.label}>Term</span> {chosenQuote?.GuaranteedTerm} years</p>
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
                        <p className={s.field}><span className={s.label}>Date of Birth</span> {quote?.birthdate}</p>
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
                            <p>
                                {application.address?.streetAddress}
                                <Optional condition={application.address?.unit}>
                                    Apt {application.address?.unit}
                                </Optional>
                            </p>
                            <p>{location?.cityName}, {location?.stateCode} {location?.code}</p>
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
                    {beneficiaries?.map((b, i) => (
                        <div className={s.beneficiaryItem} key={i}>
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
                    <img alt="Front of check" className={s.paymentImage} src={checkImages && checkImages[0]}></img>
                    <img alt="Back of check" className={s.paymentImage} src={checkImages && checkImages[1]}></img>
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
            </div>
            <div className={s.actionButtonContainer}>
                <button onClick={submitApplication} className="primary button">Submit</button>
            </div>
        </div>
    );
};

const getQuotePrice = (quote: QuickTermQuoteResult, paymentFrequency?: PremiumMode): string => {
    let quotePrice: string | number;
    quote = quote || {};
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
    quotePrice = quotePrice || 0;
    return (+quotePrice).toFixed(2);
};

interface ApplicationReviewProps {
    application: Application | undefined;
    quote: Quote | undefined;
    location: ZipCode | undefined;
    quotes?: QuickTermQuoteResult[];
    chosenQuote?: QuickTermQuoteResult;
    beneficiaries?: Beneficiary[];
    checkImages?: string[];
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

export default ApplicationReview;