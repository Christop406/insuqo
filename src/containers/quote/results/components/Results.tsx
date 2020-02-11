import React, { Component } from 'react';
import { Accordion, AccordionPanel, Anchor, Box, Heading, Paragraph } from 'grommet';
import { formatCovAmount, logoImageForCompanyID, splitPrice } from '../../../../func';
import Spinner from 'react-spinkit';
import { QuickTermQuoteResult, PremiumMode } from '@insuqo/shared';
import s from './Results.module.scss';
import IQStore, { IQStoreProps } from '../../../../store/IQStore';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { QuoteHelper } from '../../../../util/quote-helper';

interface ResultsProps extends IQStoreProps, RouteComponentProps {
    loading: boolean;
    quotes: QuickTermQuoteResult[];
    onApply: (quote: QuickTermQuoteResult, event: any) => any;
}

interface ResultsState {
    active: number;
    quotes: QuickTermQuoteResult[];
    paymentFrequency: PremiumMode;
    freqLabel: string;
}

const frequencies = [
    { val: 'month', name: 'Monthly' },
    { val: 'quarter', name: 'Quarterly' },
    { val: 'semiannual', name: 'Semi-annually' },
    { val: 'annual', name: 'Annually' }];

class Results extends Component<ResultsProps, ResultsState> {

    state: ResultsState = {
        active: 0,
        paymentFrequency: PremiumMode.MONTHLY,
        freqLabel: 'Monthly',
        quotes: this.props.quotes
    };

    formatShortFreqType = (freq: string) => {
        switch (freq) {
            case 'quarter':
                return '/ quarter';
            case 'semiannual':
                return '/ six months';
            case 'annual':
                return '/ year';
            case 'month':
            default:
                return '/ month';
        }
    };

    formatQuotes = (freq: string) => {
        const { quotes } = this.props;
        if (quotes === undefined || quotes.length === 0) {
            return <div />;
        }
        return quotes.map((quote, index) => {
            return (
                <AccordionPanel key={index} label={this.formatQuoteHeading(quote, freq)}>
                    {this.formatQuoteBody(quote)}
                </AccordionPanel>
            );
        });
    };

    formatQuoteBody = (quote: QuickTermQuoteResult) => {
        const { onApply } = this.props;
        return (
            <Box>
                <Box style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
                    <Box direction="row-responsive">
                        <Box style={{ width: '50%' }}>
                            <Heading level={3}>Provider<Paragraph
                                style={{ color: '#9c37f2' }}>{quote.CompanyName}</Paragraph></Heading>
                            <Heading level={3}>Coverage<Paragraph
                                style={{ color: '#9c37f2' }}>$ {formatCovAmount(quote.FaceAmount)}</Paragraph></Heading>
                            <Heading level={3}>Product Name<Paragraph
                                style={{ color: '#9c37f2' }}>{quote.ProductName}</Paragraph></Heading>
                        </Box>
                        <Box style={{ width: '50%', marginTop: 10, paddingRight: 10 }}>
                            <Heading level={3}>Term Length<Paragraph
                                style={{ color: '#9c37f2' }}>{quote.Term} Years</Paragraph></Heading>
                            <Heading level={3}>AMBest Rating <Anchor label="(?)" /><Paragraph
                                style={{ color: '#9c37f2' }}>{quote.AMBest}</Paragraph></Heading>
                            <Heading level={3}>Features<Paragraph
                                style={{ color: '#9c37f2' }}>{formatRider(quote)}</Paragraph></Heading>
                        </Box>
                    </Box>
                    <Box style={{ width: '100%', maxWidth: 300 }} alignSelf="center">
                        <button className="button primary full" onClick={(event: any) => {
                            onApply(quote, event);
                        }}>APPLY</button>
                    </Box>
                </Box>
            </Box>
        );
    };

    formatQuoteHeading = (quote: QuickTermQuoteResult, freq: string) => {
        const splitPremium = splitPrice(
            freq === 'month' ?
                quote.MonthlyTotalPremium :
                freq === 'annual' ?
                    quote.AnnualTotalPremium :
                    freq === 'semiannual' ?
                        quote.SemiAnnualTotalPremium :
                        freq === 'quarter' ?
                            quote.QuarterlyTotalPremium :
                            0.00
        );
        return (
            <div className={s.quoteHeader}>
                <div className={s.companyImageContainer}>
                    <img
                        className={s.companyImage}
                        style={{ marginTop: 10 }}
                        alt={'logo-' + quote.CompanyID}
                        height={60}
                        src={logoImageForCompanyID(quote.CompanyID)}
                    />
                </div>
                <span className={s.companyName}>{quote.CompanyName}</span>
                <Box fill="horizontal">
                    <Box fill="vertical" direction="row" align="center" justify="center">
                        <Box direction="row" style={{ height: 50 }} align="center">
                            <span>$</span>
                            <span style={{ fontSize: 40, fontWeight: 'bold' }}>{splitPremium[0]}</span>
                            <span style={{
                                fontSize: 20,
                                verticalAlign: 'top',
                                fontWeight: 'bold'
                            }}>{splitPremium[1]}</span>
                            <span style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                verticalAlign: 'bottom',
                                color: '#888'
                            }}>&nbsp;{this.formatShortFreqType(freq)}</span>
                        </Box>
                    </Box>
                </Box>
            </div>
        );
    };

    updateActiveIndex = (active: any) => {
        this.setState({ active: active[0] });
    };

    updateFreq = (newFreq: any) => {
        const oldQuotes = this.props.quotes;
        const paymentFrequency = newFreq.target.value;

        let quotes: QuickTermQuoteResult[] = [];
        quotes = quotes.concat(oldQuotes).sort((a, b) => QuoteHelper.quoteSortValue(a, b, paymentFrequency));

        this.setState({ paymentFrequency, quotes });
    };

    render = () => {
        const { active, paymentFrequency } = this.state;
        const { loading } = this.props;
        return (
            <>
                {loading ?
                    <div className={s.loadingContainer} style={{ visibility: loading ? 'visible' : 'hidden' }}>
                        <Spinner fadeIn="none" name='folding-cube' color="#9c37f2" />
                    </div> :
                    <>
                        <h1 className="text-primary">Here are your quotes</h1>
                        <h3 className={s.quoteSubtitle}>Click on each for more info.</h3>
                        <div className={s.paymentFrequencyContainer}>
                            <h5 className={s.frequencyLabel}>Payment Frequency </h5>
                            <select className="input select inline" value={paymentFrequency} onChange={this.updateFreq}>
                                {frequencies.map((option, index) => <option value={option.val}
                                    key={index}>{option.name}</option>)}
                            </select>
                        </div>
                        <Accordion animate onActive={this.updateActiveIndex}
                            activeIndex={loading ? undefined : active}>
                            {this.formatQuotes(paymentFrequency)}
                        </Accordion>
                    </>
                }
            </>
        );
    };
}

const formatRider = (quote: QuickTermQuoteResult) => {
    if (Number(quote.AnnualADBPremium) !== 0) {
        return 'Accidental Death Rider';
    } else if (Number(quote.AnnualChildRiderPremium) !== 0) {
        return 'Child Rider';
    } else if (Number(quote.AnnualReturnOfPremiumPremium) !== 0) {
        return 'Return of Premium';
    } else if (Number(quote.AnnualWaiverOfPremiumPremium) !== 0) {
        return 'Waiver of Premium';
    }
    return 'None';
};

export default IQStore.withStore(withRouter(Results));
