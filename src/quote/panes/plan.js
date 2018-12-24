import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import {Anchor, Box, Button, Heading, Paragraph, RangeInput} from "grommet";

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    }
};

class Plan extends Component {

    state = {
        covAmount: 10000,
        termLength: '75'
    };

    updateCovAmount = event => {
        this.setState({covAmount: event.target.value});
    };

    updateTermLength = event => {
        this.setState({termLength: event.target.value});
    };

    formatCovAmount = (x) => {
        if(x === undefined) return '';
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    formatTermLength = (len) => {
        console.log(typeof len);
        if(len === '25') return '10';
        if(len === '50') return '15';
        if(len === '75') return '20';
        if(len === '100') return '30';
    };

    submitPlanInfo = () => {
        const store = this.props.store;
        const { covAmount, termLength } = this.state;
        store.set('covAmount')(covAmount);
        store.set('termLength')(Number(this.formatTermLength(termLength)));
    };

    render = () => {
        const { covAmount, termLength } = this.state;
        return(
            <Box animation="fadeIn">
                <Heading margin="xsmall" level={1} color="#9c37f2">Choose your coverage.</Heading>
                <Heading margin="small" style={styles.quoteSubtitle} color="dark-4" level={3}>You can change these values later.</Heading>
                <Paragraph style={{maxWidth: '600px'}} margin="small">
                    These values help insurers calculate how much you need to pay for your insurance. <Anchor label="Help me choose!"/>
                </Paragraph>
                <Heading margin="small" level={3} color="#9c37f2">Coverage Amount</Heading>
                <Box align="end" margin="small">
                    <RangeInput name="covAmount" onChange={this.updateCovAmount} step={100000} min={100000} max={2000000} value={covAmount}/>
                    <Heading margin="xsmall" level={2} color="#9c37f2">$ {this.formatCovAmount(covAmount)}</Heading>
                </Box>
                <Heading margin="small" level={3} color="#9c37f2">Term Length</Heading>
                <Box align="end" margin="small">
                    <RangeInput name="covAmount" onChange={this.updateTermLength} step={25} min={25} max={100} value={termLength}/>
                    <Heading margin="xsmall" level={2} color="#9c37f2">{this.formatTermLength(termLength)} Years</Heading>
                </Box>
                <Button onClick={this.submitPlanInfo} color="#9c37f2" fill label="Go to Confirmation" primary />
            </Box>
        );
    };
}

export default Store.withStore(Plan);