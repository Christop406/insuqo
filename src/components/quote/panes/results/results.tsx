import React, { Component } from 'react';
import Store from '../../../../ApplicationStore';
import { Accordion, AccordionPanel, Anchor, Box, Heading, Paragraph } from 'grommet';
import dayjs from 'dayjs';
import { formatCovAmount, logoImageForCompanyID, splitPrice } from '../../../../func';
import { QuoteService } from '../../../../services/quote.service';
import Spinner from 'react-spinkit';
import { Store as S } from 'undux';
import { History, LocationState } from 'history';
import { QuickTermQuoteResult, Address, PremiumMode } from '@insuqo/shared';
import ClientAuthentication from '../../../../controllers/auth/ClientAuthentication';
import { ApplicationService } from '../../../../services/application.service';
import { Logger } from '../../../../services/logger';
import { Auth } from '../../../../services/firebase';
import qs from 'query-string';
import s from './results.module.scss';

interface ResultsProps {
    store: S<any>;
    history: History<LocationState>;
}

interface ResultsState {
    loading: boolean;
    quotes: QuickTermQuoteResult[];
    active: number;
    freq: PremiumMode;
    freqLabel: string;
    showAuthModal: boolean;
    selectedQuote?: QuickTermQuoteResult;
}

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    },
    sexButtons: {
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 5
    },
    quoteListLabel: {
        minWidth: 50
    }
};

const frequencies = [
    { val: 'month', name: 'Monthly' },
    { val: 'quarter', name: 'Quarterly' },
    { val: 'semiannual', name: 'Semi-annually' },
    { val: 'annual', name: 'Annually' }];

class Results extends Component<ResultsProps, ResultsState> {

    state: ResultsState = {
        loading: true,
        quotes: [],
        active: 0,
        freq: PremiumMode.MONTHLY,
        freqLabel: 'Monthly',
        showAuthModal: false,
    };

    private applicationService = new ApplicationService();
    private quoteService = new QuoteService();

    private location?: Partial<Address>;
    private birthDate?: string;

    getQuotes = () => {
        const store = this.props.store;
        const stateCode = store.get('stateCode');
        const birthdate = store.get('birthdate');
        const sex = store.get('sex');
        const covAmount = store.get('covAmount');
        const termLength = store.get('termLength');
        const rider = store.get('rider');

        const now = dayjs();
        const birthTime = dayjs(birthdate, 'YYYY-MM-DD');
        const actualAge = now.diff(birthTime, 'year');
        const nearestAge = Math.round(now.diff(birthTime, 'year', true));

        const tobacco = store.get('tobacco');
        const cannabis = store.get('cannabis');
        const healthType = tobacco || cannabis ? 'preferred_smoker' : 'preferred_non_smoker';

        return this.quoteService.runQuotes(stateCode, actualAge, nearestAge, covAmount, termLength, healthType, sex, rider, 10);
    };

    componentDidMount = async () => {
        window.scrollTo({ top: 0 });
        const { store } = this.props;
        const { freq } = this.state;
        const { search } = this.props.history.location;
        Logger.log(search);
        if (search) {
            const query = qs.parse(search.slice(1), {});
            console.log(query);
            if (query.id) {
                query.id = Array.isArray(query.id) ? query.id[0] : query.id;
                const retrievedQuotes = await this.quoteService.getQuotesByKey(query.id);
                retrievedQuotes?.sort((a, b) => qutoeSortValue(a, b, freq));
                if (retrievedQuotes) {
                    this.setState({ loading: false, quotes: retrievedQuotes });
                    return;
                } else {
                    this.props.history.push({ search: '' });
                }
            }
        }

        try {
            const newQuotes = await this.getQuotes();
            Logger.debug(newQuotes);
            this.setState({ loading: false, quotes: newQuotes.data!.quotes });
            this.props.history.push({ search: qs.stringify({ id: newQuotes.data?.key }) });
        } catch (error) {
            Logger.error(error);
            throw error;
        }

        this.location = {
            city: store.get('city'),
            state: store.get('stateCode'),
            zipCode: store.get('zipCode')
        };

        this.birthDate = store.get('birthdate');
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
        const { quotes } = this.state;
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
                            this.apply(quote, event);
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

    apply = async (quote: QuickTermQuoteResult, event: any) => {
        event.preventDefault();
        console.log('apply');
        Auth.onAuthStateChanged(async (user) => {
            console.log('auth');
            if (user) {
                console.log('logged in');
                await this.createApplication(quote);
            } else {
                console.log('logged OUT');
                this.setState({ showAuthModal: true, selectedQuote: quote });
            }
        });
    };

    private createApplication = async (quote: QuickTermQuoteResult) => {
        console.log('creating');
        const app = await this.applicationService.createApplication(quote.id, quote.RecID, this.birthDate!, this.location!);
        console.log('created?');
        if (app && app.id) {
            console.log(app);
            this.props.history.push(`/application/${app.id}/apply`);
        } else {
            console.log('err');
            throw new Error('There was an error creating the application');
        }
    };

    handleAuthentication = async () => {
        this.setState({ showAuthModal: false });
        const { selectedQuote } = this.state;

        if (selectedQuote) {
            await this.createApplication(selectedQuote);
        }
    };

    updateFreq = (newFreq: any) => {
        const oldQuotes = this.state.quotes;
        const freq = newFreq.target.value;

        let quotes: QuickTermQuoteResult[] = [];
        quotes = quotes.concat(oldQuotes).sort((a, b) => qutoeSortValue(a, b, freq));

        this.setState({ freq, quotes });
    };

    render = () => {
        const { active, loading, freq, showAuthModal } = this.state;
        return (
            <>
                {loading ?
                    <div className={s.loadingContainer} style={{ visibility: loading ? 'visible' : 'hidden' }}>
                        <Spinner fadeIn="none" name='folding-cube' color="#9c37f2" />
                    </div> :
                    <>
                        <h1 className="text-primary">Here are your quotes</h1>
                        <h3 style={styles.quoteSubtitle}>Click on each for more info.</h3>
                        <div className={s.paymentFrequencyContainer}>
                            <h5 className={s.frequencyLabel}>Payment Frequency </h5>
                            <select className="input select inline" value={freq} onBlur={this.updateFreq}>
                                {frequencies.map((option, index) => <option value={option.val}
                                    key={index}>{option.name}</option>)}
                            </select>
                        </div>
                        <Accordion animate onActive={this.updateActiveIndex}
                            activeIndex={loading ? undefined : active}>
                            {this.formatQuotes(freq)}
                        </Accordion>
                        {showAuthModal &&
                            <ClientAuthentication type="signup" onAuthenticate={this.handleAuthentication} />}
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

const qutoeSortValue = (a: QuickTermQuoteResult, b: QuickTermQuoteResult, paymentFreq: PremiumMode): number => {
    let property: keyof QuickTermQuoteResult = 'MonthlyTotalPremium';
    switch (paymentFreq) {
        case PremiumMode.QUARTERLY:
            property = 'QuarterlyTotalPremium';
            break;
        case PremiumMode.SEMI_ANNUALLY:
            property = 'SemiAnnualTotalPremium';
            break;
        case PremiumMode.ANNUAL:
            property = 'AnnualTotalPremium';
            break;
    }

    return Number(a[property]) - Number(b[property]);
};

export default Store.withStore(Results);
