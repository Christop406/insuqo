import React, {Component} from 'react';
import Store from '../../../../ApplicationStore';
import {Accordion, AccordionPanel, Anchor, Box, Button, Heading, Paragraph} from 'grommet';
import moment from 'moment';
import {formatCovAmount, logoImageForCompanyID, splitPrice} from '../../../../func';
import {QuoteService} from '../../../../services/quote.service';
import Spinner from 'react-spinkit';
import {Store as S} from 'undux';
import {History, LocationState} from 'history';
import {QuickTermQuoteResult} from 'insuqo-shared';
import {AuthenticationService} from "../../../../services/authentication.service";
import {ClientAuthentication} from "../../../../controllers/sign-up/ClientAuthentication";
import {CognitoUser} from "amazon-cognito-identity-js";

interface ResultsProps {
    store: S<any>;
    history: History<LocationState>;
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
    {val: 'month', name: 'Monthly'},
    {val: 'quarter', name: 'Quarterly'},
    {val: 'semiannual', name: 'Semi-annually'},
    {val: 'annual', name: 'Annually'}];

class Results extends Component<ResultsProps> {

    state = {
        loading: true,
        quotes: [],
        active: 0,
        freq: 'month',
        freqLabel: 'Monthly',
        showAuthModal: false,
    };

    getQuotes = () => {
        const store = this.props.store;
        const stateCode = store.get('stateCode');
        const birthdate = store.get('birthdate');
        const sex = store.get('sex');
        const covAmount = store.get('covAmount');
        const termLength = store.get('termLength');
        const rider = store.get('rider');

        const now = moment();
        const birthTime = moment(birthdate, 'MM/DD/YYYY');
        const actualAge = now.diff(birthTime, 'years');
        const nearestAge = Math.round(now.diff(birthTime, 'years', true));

        const tobacco = store.get('tobacco');
        const cannabis = store.get('cannabis');
        const healthType = tobacco || cannabis ? 'preferred_smoker' : 'preferred_non_smoker';

        return (new QuoteService()).runQuotes(stateCode, actualAge, nearestAge, covAmount, termLength, healthType, sex, rider, 10);
    };

    componentDidMount = async () => {
        let quoteKey = localStorage.getItem('quoteKey');
        if (quoteKey) {
            const quotes = await new QuoteService().getQuotesByKey(quoteKey);
            this.setState({quotes});
            // if (q !== undefined && q !== null) this.setState({loading: false, quotes: JSON.parse(q!)});
        } else {
            try {
                const newQuotes = await this.getQuotes();
                console.log(newQuotes);
                quoteKey = newQuotes.data!.key;
                this.setState({loading: false, quoteKey, quotes: newQuotes.data!.quotes});
                localStorage.setItem('quoteKey', JSON.stringify(quoteKey));
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    };

    formatRider = (quote: QuickTermQuoteResult) => {
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
        const {quotes} = this.state;
        if (quotes === undefined || quotes.length === 0) {
            return <div/>;
        }
        return quotes.map((quote, index) => {
            return (
                <AccordionPanel key={index} label={this.formatQuoteHeading(quote, index, freq)}>
                    {this.formatQuoteBody(quote, index, freq)}
                </AccordionPanel>
            );
        });
    };

    formatQuoteBody = (quote: QuickTermQuoteResult, index: number, freq: string) => {
        const {active} = this.state;
        return (
            <Box>
                <Box style={{backgroundColor: '#F5F5F5', padding: 10}}>
                    <Box direction="row-responsive">
                        <Box style={{width: '50%'}}>
                            <Heading level={3}>Provider<Paragraph
                                style={{color: '#9c37f2'}}>{quote.CompanyName}</Paragraph></Heading>
                            <Heading level={3}>Coverage<Paragraph
                                style={{color: '#9c37f2'}}>$ {formatCovAmount(quote.FaceAmount)}</Paragraph></Heading>
                            <Heading level={3}>Product Name<Paragraph
                                style={{color: '#9c37f2'}}>{quote.ProductName}</Paragraph></Heading>
                        </Box>
                        <Box style={{width: '50%', marginTop: 10, paddingRight: 10}}>
                            <Heading level={3}>Term Length<Paragraph
                                style={{color: '#9c37f2'}}>{quote.Term} Years</Paragraph></Heading>
                            <Heading level={3}>AMBest Rating <Anchor label="(?)"/><Paragraph
                                style={{color: '#9c37f2'}}>{quote.AMBest}</Paragraph></Heading>
                            <Heading level={3}>Features<Paragraph
                                style={{color: '#9c37f2'}}>{this.formatRider(quote)}</Paragraph></Heading>
                        </Box>
                    </Box>
                    <Box style={{width: '100%', maxWidth: 300}} alignSelf="center">
                        <Button primary={active === index} onClick={(event: any) => {
                            this.apply(quote, event);
                        }} fill={false} hoverIndicator="#EAC4FF" label="APPLY"/>
                    </Box>
                </Box>
            </Box>
        );
    };

    formatQuoteHeading = (quote: QuickTermQuoteResult, index: number, freq: string) => {
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
            <Box direction="row-responsive" fill="horizontal" align="stretch" margin="small" alignSelf="stretch">
                <Heading
                    style={{maxWidth: 'none'}}
                    level={3}>
                    <Box direction="row" alignSelf="stretch">
                        <Box fill="horizontal" align="center" style={{minWidth: 150}}>
                            <img
                                style={{marginTop: 10}}
                                alt={'logo-' + quote.CompanyID}
                                height={60}
                                src={logoImageForCompanyID(quote.CompanyID)}
                            />
                        </Box>
                    </Box>
                </Heading>
                <Box fill="horizontal" justify="center" align="center">
                    <Heading style={{width: '100%'}} truncate level={3} margin="none">{quote.CompanyName}</Heading>
                </Box>
                <Box fill="horizontal">
                    <Box fill="vertical" direction="row" align="center" justify="center">
                        <Box direction="row" style={{height: 50}} align="center">
                            <span>$</span>
                            <span style={{fontSize: 40, fontWeight: 'bold'}}>{splitPremium[0]}</span>
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
            </Box>
        );
    };

    updateActiveIndex = (active: any) => {
        this.setState({active: active[0]});
    };

    apply = async (quote: QuickTermQuoteResult, event: any) => {
        event.preventDefault();
        try {
            const userSession = await AuthenticationService.getCurrentSession();
            if (userSession.isValid()) {
                this.props.store.set('quote')(quote);
                localStorage.setItem('quote', JSON.stringify(quote));
                this.props.history.push('/application');
            } else {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Session is invalid');
            }
        } catch (err) {
            this.setState({showAuthModal: true});
        }
    };

    handleAuthentication = (user: CognitoUser) => {
        // save user?
        // Persist quotes to the user
    };

    updateFreq = (newFreq: any) => {
        this.setState({freq: newFreq.target.value});
    };

    render = () => {
        const {active, loading, freq, showAuthModal} = this.state;
        return (
            <Box fill>
                {loading ?
                    <Box fill align="center" justify="center" style={{visibility: loading ? 'visible' : 'hidden'}}>
                        <Spinner style={{marginTop: '45%'}} name='folding-cube' color="#9c37f2"/>
                    </Box> :
                    <Box>
                        <Heading margin="xsmall" level={1} color="#9c37f2">Here are your quotes</Heading>
                        <Heading margin="xsmall" style={styles.quoteSubtitle} color="dark-4" level={3}>Click on each for
                            more info.</Heading>
                        <Box background={{color: '#FFFFFF'}} direction="row-responsive" justify="end" align="center">
                            <Heading margin="xsmall" level={5}>Choose payment frequency: </Heading>
                            {/* eslint-disable-next-line react/no-children-prop */}
                            <select value={freq} onChange={this.updateFreq}
                                    children={frequencies.map((option, index) => <option value={option.val}
                                                                                         key={index}>{option.name}</option>)}/>
                        </Box>
                        <Box style={{paddingLeft: 5, paddingRight: 5}}>
                            <Accordion animate={false} onActive={this.updateActiveIndex}
                                       activeIndex={loading ? undefined : active}>
                                {this.formatQuotes(freq)}
                            </Accordion>
                        </Box>
                        {showAuthModal &&
						<ClientAuthentication type="signup" onAuthenticate={this.handleAuthentication}/>}
                    </Box>
                }
            </Box>
        );
    };
}

export default Store.withStore(Results);
