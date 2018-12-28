import React, { Component } from 'react';
import Store from '../../../ApplicationStore';
import {Accordion, AccordionPanel, Anchor, Box, Button, Heading, Paragraph} from "grommet";
import {getQuote} from "../../../api";
import moment from 'moment';
import {formatCovAmount, logoImageForCompanyID} from "../../../func";

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
        quotes: []
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
        this.getQuotes().then(res => {
            // todo - handle errors
            let data = res.data;
            this.setState({quotes: data});
        });
    };

    splitPrice = (price) => {
        if(price == null || price === undefined) {
            return ['0', '00'];
        }

        let splitString = String(price).split('.');
        if(splitString[0] === undefined) {
            splitString[0] = '0';
        }
        if(splitString[1] === undefined) {
            splitString[1] = '00';
        } else {
            splitString[1] = splitString[1].substring(0, 2);
        }

        return splitString;

    };

    formatQuotes = () => {
        const { quotes } = this.state;
        if(quotes === undefined || quotes.length === 0) {
            return <div/>;
        }
        return quotes.map((quote, index) => {
            return(
                <AccordionPanel key={index} activeIndex={0} label={this.formatQuoteHeading(quote)}>
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
                    <Box border="left" style={{width: '50%', marginTop: 10, marginBottom: 10, paddingLeft: 10, paddingRight: 10}}>
                        <Heading level={3}>Term Length<Paragraph style={{color: '#9c37f2'}}>{quote.term} Years</Paragraph></Heading>
                        <Heading level={3}>AMBest Rating <Anchor label="(?)"/><Paragraph style={{color: '#9c37f2'}}>{quote.amBest}</Paragraph></Heading>
                    </Box>
                </Box>
            </Box>
        );
    };

    formatQuoteHeading = (quote) => {
        let splitPremium = this.splitPrice(quote.monthlyTotalPremium);
        return (
            <Box direction="row-responsive" fill="horizontal" align="stretch" margin="small" alignSelf="stretch">
                <Heading
                    style={{maxWidth: 'none'}}
                    level={3}>
                    <Box direction="horizontal" alignSelf="stretch">
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
                    <Button fill={false} hoverIndicator="#EAC4FF" label="APPLY"/>
                </Box>
            </Box>
        );
    };

    render = () => {
        return (
            <Box>
                <Heading margin="xsmall" level={1} color="#9c37f2">Here are your quotes</Heading>
                <Heading margin="xsmall" style={styles.quoteSubtitle} color="dark-4" level={3}>Click on each for more info.</Heading>
                <Box style={{paddingLeft: 10, paddingRight: 10}}>
                    <Accordion activeIndex={0} style={{overflowY: 'scroll'}}>
                        {this.formatQuotes()}
                    </Accordion>
                </Box>
            </Box>
        );
    };
}

export default Store.withStore(Results);