import React, { Component } from 'react';
import Store from '../../../ApplicationStore';
import {Accordion, AccordionPanel, Anchor, Box, Button, Heading, Paragraph} from "grommet";
import {getQuote} from "../../../api";
import moment from 'moment';
import {formatCovAmount, logoImageForCompanyID, splitPrice} from "../../../func";
import Spinner from 'react-spinkit';

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

class Results extends Component {

    state = {
        loading: true,
        quotes: [],
        active: 0,
        freq: 'month'
    };

    getQuotes = () => {
        const store = this.props.store;
        const stateCode = store.get('stateCode') || 'CA';
        const birthdate = store.get('birthdate') || '12/21/1997';
        const sex = store.get('sex') || 'male';
        const covAmount = store.get('covAmount') || 100000;
        const termLength = store.get('termLength') || 20;
        const rider = store.get('rider') || 'none';

        const now = moment();
        const birthTime = moment(birthdate, "MM/DD/YYYY");
        const actualAge = now.diff(birthTime, 'years');
        const nearestAge = Math.round(now.diff(birthTime, 'years', true));

        const tobacco = store.get('tobacco');
        const cannabis = store.get('cannabis');
        const healthType = tobacco || cannabis ? 'preferred_smoker' : 'preferred_non_smoker';

        return getQuote(stateCode,actualAge,nearestAge,covAmount,termLength,healthType,sex,rider,10)
    };

    componentDidMount = () => {
        if(localStorage.getItem("quotes_ran") === "true") {
            this.setState({loading: false, quotes: JSON.parse(localStorage.getItem("quotes"))});
        } else {
            this.getQuotes().then(res => {
                localStorage.setItem("quotes_ran", "true");
                // todo - handle errors
                let data = res.data;
                this.setState({loading: false, quotes: data});
                localStorage.setItem("quotes", JSON.stringify(data));
            });
        }
    };

    formatRider = quote => {
        if(quote.annualADBPremium !== 0) {
            return "Accidental Death Rider";
        } else if(quote.annualChildRiderPremium !== 0) {
            return "Child Rider";
        } else if(quote.annualReturnOfPremiumPremium !== 0) {
            return "Return of Premium";
        } else if(quote.annualWaiverOfPremiumPremium !== 0) {
            return "Waiver of Premium";
        }
        return "None";
    };

    formatQuotes = () => {
        const { quotes } = this.state;
        if(quotes === undefined || quotes.length === 0) {
            return <div/>;
        }
        return quotes.map((quote, index) => {
            return(
                <AccordionPanel key={index} activeIndex={0} label={this.formatQuoteHeading(quote, index)}>
                    {this.formatQuoteBody(quote)}
                </AccordionPanel>
            );
        });
    };

    formatQuoteBody = (quote) => {
        return(
            <Box>
                <Box style={{backgroundColor: '#F5F5F5'}} direction="row-responsive">
                    <Box style={{width: '50%', padding: 10}}>
                        <Heading level={3}>Provider<Paragraph style={{color: '#9c37f2'}}>{quote.companyName}</Paragraph></Heading>
                        <Heading level={3}>Coverage<Paragraph style={{color: '#9c37f2'}}>$ {formatCovAmount(quote.faceAmount)}</Paragraph></Heading>
                        <Heading level={3}>Product Name<Paragraph style={{color: '#9c37f2'}}>{quote.productName}</Paragraph></Heading>
                    </Box>
                    <Box style={{width: '50%', marginTop: 10, marginBottom: 10, paddingLeft: 10, paddingRight: 10}}>
                        <Heading level={3}>Term Length<Paragraph style={{color: '#9c37f2'}}>{quote.term} Years</Paragraph></Heading>
                        <Heading level={3}>AMBest Rating <Anchor label="(?)"/><Paragraph style={{color: '#9c37f2'}}>{quote.amBest}</Paragraph></Heading>
                        <Heading level={3}>Features<Paragraph style={{color: '#9c37f2'}}>{this.formatRider(quote)}</Paragraph></Heading>
                    </Box>
                </Box>
            </Box>
        );
    };

    formatQuoteHeading = (quote, index) => {
        let splitPremium = splitPrice(quote.monthlyTotalPremium);
        const { active } = this.state;
        return (
            <Box direction="row-responsive" fill="horizontal" align="stretch" margin="small" alignSelf="stretch">
                <Heading
                    style={{maxWidth: 'none'}}
                    level={3}>
                    <Box direction="row" alignSelf="stretch">
                        <Box fill="horizontal" align="center" style={{minWidth: 150}}>
                            <img
                                style={{marginTop: 10}}
                                alt={"logo-" + quote.companyID}
                                height={60}
                                src={logoImageForCompanyID(quote.companyID)}
                            />
                        </Box>
                    </Box>
                </Heading>
                <Box fill="horizontal">
                    <Box fill="vertical" direction="row" align="center" justify="center">
                        <Box direction="row" style={{height: 50}} align="center">
                            <span>$</span>
                            <span style={{fontSize: 40, fontWeight: 'bold'}}>{splitPremium[0]}</span>
                            <span style={{fontSize: 20, verticalAlign: 'top', fontWeight: 'bold'}}>{splitPremium[1]}</span>
                            <span style={{fontSize: 20, fontWeight: 'bold', verticalAlign: 'bottom'}}>/MO</span>
                        </Box>
                    </Box>
                </Box>
                <Box fill="horizontal" justify="center" align="center">
                    <Button primary={active === index} onClick={() => {this.apply(quote)}} fill={false} hoverIndicator="#EAC4FF" label="APPLY"/>
                </Box>
            </Box>
        );
    };

    updateActiveIndex = (active) => {
        this.setState({active: active[0]});
    };

    apply = quote => {
        let that = this;
        this.props.store.set('quote')(quote);
        //localStorage.setItem('quote', JSON.stringify(quote));
        setTimeout(function (){
            that.props.history.push('/application');
        }, 1000);
    };

    updateFreq = (newFreq) => {
        this.setState({freq: newFreq});
    };

    render = () => {
        const { active, loading } = this.state;
        return (
            <Box>
                {loading ?
                    <Box style={{visibility: loading ? 'visible' : 'hidden'}}>
                        <Spinner name='folding-cube' color="#9c37f2"/>
                    </Box> :
                    <Box>
                        <Heading margin="xsmall" level={1} color="#9c37f2">Here are your quotes</Heading>
                        <Heading margin="xsmall" style={styles.quoteSubtitle} color="dark-4" level={3}>Click on each for more info.</Heading>
                        <Box style={{paddingLeft: 5, paddingRight: 5, overflowY: 'scroll', WebkitOverflowScrolling: 'touch'}}>
                            <Accordion onActive={this.updateActiveIndex} activeIndex={loading ? undefined : active}>
                                {this.formatQuotes()}
                            </Accordion>
                        </Box>
                    </Box>
                }
            </Box>
        );
    };
}

export default Store.withStore(Results);