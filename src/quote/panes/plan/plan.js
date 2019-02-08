import React, { Component } from 'react';
import Store from '../../../ApplicationStore';
import {Anchor, Box, Button, Heading, Paragraph, RadioButton, RangeInput} from "grommet";
import {formatCovAmount} from "../../../func";
import {Modal} from "antd";
import PlanInfoModal from "./plan-info-modal";
import RiderInfoModal from "./rider-info-modal";

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    }
};

class Plan extends Component {

    state = {
        covAmount: 500000,
        termLength: '75',
        rider: 'none'
    };

    updateCovAmount = event => {
        this.setState({covAmount: event.target.value});
    };

    updateTermLength = event => {
        this.setState({termLength: event.target.value});
    };

    updateRider = event => {
        this.setState({rider: event.target.name});
    };

    formatTermLength = (len) => {
        //console.log(typeof len);
        if(len === '25') return '10';
        if(len === '50') return '15';
        if(len === '75') return '20';
        if(len === '100') return '30';
    };

    showHelpMeChoose = () => {
        Modal.info({
            title: 'How to choose the right coverage',
            content: <PlanInfoModal/>
        });
    };

    showRiderInfo = () => {
        Modal.info({
            title: 'More on Riders',
            content: <RiderInfoModal/>,
            centered: true
        });
    };

    submitPlanInfo = () => {
        const store = this.props.store;
        const { covAmount, termLength, rider } = this.state;
        store.set('covAmount')(covAmount);
        store.set('termLength')(Number(this.formatTermLength(termLength)));
        store.set('rider')(rider);
        this.props.history.push('/quote/results');
    };

    componentDidMount = () => {
        let cA = localStorage.getItem('covAmount');
        let tL = localStorage.getItem('termLength');
        let rd = localStorage.getItem('rider');
        if(cA == null) {
            cA = JSON.stringify(500000);
        }
        if(tL === null || tL === undefined || tL.length === 0) {
           // todo: implement
        }

        if(rd == null || rd.length === 0) {
            rd = 'none';
        }

        this.setState({covAmount: cA, rider: rd});
    };

    render = () => {
        const { covAmount, termLength, rider } = this.state;
        return(
            <Box animation="fadeIn">
                <Heading margin="xsmall" level={1} color="#9c37f2">Choose your coverage.</Heading>
                <Heading margin="small" style={styles.quoteSubtitle} color="dark-4" level={3}>You can change these values later.</Heading>
                <Paragraph style={{maxWidth: '600px'}} margin="small">
                    These values help insurers calculate how much you need to pay for your insurance. <Anchor onClick={this.showHelpMeChoose} label="Help me choose!"/>
                </Paragraph>
                <Heading margin="small" level={3} color="#9c37f2">Coverage Amount</Heading>
                <Box align="end" margin="small">
                    <RangeInput name="covAmount" onChange={this.updateCovAmount} step={100000} min={100000} max={2000000} value={covAmount}/>
                    <Heading margin="xsmall" level={2} color="#9c37f2">$ {formatCovAmount(covAmount)}</Heading>
                </Box>
                <Heading margin="small" level={3} color="#9c37f2">Term Length</Heading>
                <Box align="end" margin="small">
                    <RangeInput name="covAmount" onChange={this.updateTermLength} step={25} min={25} max={100} value={termLength}/>
                    <Heading margin="xsmall" level={2} color="#9c37f2">{this.formatTermLength(termLength)} Years</Heading>
                </Box>
                <Box margin="small">
                    <Heading margin="xsmall" level={2} color="#9c37f2">Other Options</Heading>
                    <Heading margin="small" level={3} color="#9c37f2">Riders</Heading>
                    <Anchor margin="small" style={{marginTop: -10}} color="dark-4" onClick={this.showRiderInfo} label="What are these?"/>
                    <span style={{height: '10px'}}/>
                    <Box margin="small" style={styles.sexButtons}>
                        <RadioButton checked={rider === 'accidental_death'} name="accidental_death" onChange={this.updateRider} label="Accidental Death"/>
                        <span style={{display: 'block', height: 20}}/>
                        <RadioButton checked={rider === 'waiver_premium'} name="waiver_premium" onChange={this.updateRider} label="Waiver of Premium"/>
                        <span style={{height: 20}}/>
                        <RadioButton checked={rider === 'return_premium'} name="return_premium" onChange={this.updateRider} label="Return of Premium"/>
                        <span style={{height: 20}}/>
                        <RadioButton checked={rider === 'child'} name="child" onChange={this.updateRider} label="Child Rider"/>
                        <span style={{height: 20}}/>
                        <RadioButton checked={rider === 'none'} name="none" onChange={this.updateRider} label="None"/>
                        <span style={{height: 30}}/>
                    </Box>
                </Box>
                <Button onClick={this.submitPlanInfo} color="#9c37f2" label="Get Quotes" primary />
            </Box>
        );
    };
}

export default Store.withStore(Plan);