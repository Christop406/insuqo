import React, { Component } from 'react';
import Store from '../ApplicationStore';
import {Box, Button, Heading, Select, TextInput} from "grommet/es6";
import {identity} from "rxjs";
import {makeid} from '../func';
import relations from './relations';

class BeneficiaryList extends Component {

    beneficiary = {
        "fname" : undefined,
        "middleI" : undefined,
        "lname": undefined,
        "rel" : undefined,
        "share" : undefined
    };

    state = {
        beneficiaries: [],
        idCounter: 0
    };

    addBeneficiary = () => {

        console.log('adding ben');

        let id = makeid();

        this.setState(prevState => ({
            beneficiaries: [...prevState.beneficiaries, id],
            [id + '-fname']: '',
            [id + '-middleI']: '',
            [id + '-lname']: '',
            [id + '-rel']: {"code" : "chs", "name" : "Relationship"},
            [id + '-share']: ''
        }));
    };

    deleteBeneficiary = id => {
        this.setState(prevState => ({beneficiaries: prevState.beneficiaries.filter((ben, ind) => {
            return ben !== id;
        }),
        [id + '-fname']: undefined,
        [id + '-middleI']: undefined,
        [id + '-lname']: undefined,
        [id + '-rel']: undefined,
        [id + '-share']: undefined}))
    };

    updateBenInfo = event => {
        this.setState({[event.target.name]: event.target.value});
        this.updateParent(event);
    };

    updateBenRelation = event => {
        this.setState({[event.target.name]: event.value});
        this.updateParent(event);
    };

    updateParent = event => {
        console.log(event.target.name);
        const id = event.target.name.substr(0, event.target.name.indexOf('-'));
        const field = event.target.name.substr(event.target.name.indexOf('-') + 1);
        this.beneficiary["fname"] = this.state[id + '-fname'];
        this.beneficiary["middleI"] = this.state[id + '-middleI'];
        this.beneficiary["lname"] = this.state[id + '-lname'];
        this.beneficiary["rel"] = this.state[id + '-rel'];
        this.beneficiary["share"] = this.state[id + '-share'];
        if(field === "rel") {
            this.beneficiary[field] = event.value;
        } else {
            this.beneficiary[field] = event.target.value;
        }
        this.props.onUpdate(id, this.beneficiary);
    };

    componentDidMount = () => {
        this.addBeneficiary();
    };

    displayBeneficiaries = () => {
        const { beneficiaries } = this.state;
        return beneficiaries.map((value, index) => {
            return(
                <Box margin={{top: 'small', bottom: 'small'}} key={value} pad="small" animation="zoomIn" elevation="small" round="small" gap="small" fill="horizontal">
                    <Box fill wrap gap="small">
                        <Heading margin="xxsmall" level={3}>Beneficiary {index + 1}</Heading>
                        <Box wrap flex="grow" justify="between" direction="row">
                            <Box flex="grow" align="center">
                                <TextInput id={value + '-fname'}
                                           name={value + '-fname'}
                                           value={this.state[value + '-fname']}
                                           onChange={this.updateBenInfo}
                                           placeholder="First Name"/>
                            </Box>
                            <span className="hideOnXSmallScreens" style={{width: 10}}/>
                            <div className="showOnXSmallScreens"/>
                            <Box align="center" flex="grow" width="small">
                                <TextInput id={value + '-middleI'}
                                           name={value + '-middleI'}
                                           value={this.state[value + '-middleI']}
                                           onChange={this.updateBenInfo}
                                           placeholder="Middle Initial"/>
                            </Box>
                            <span className="hideOnXSmallScreens" style={{width: 10}}/>
                            <div className="showOnXSmallScreens"/>
                            <Box align="center" flex="grow">
                                <TextInput id={value + '-lname'}
                                           name={value + '-lname'}
                                           value={this.state[value + '-lname']}
                                           onChange={this.updateBenInfo}
                                           placeholder="Last Name"/>
                            </Box>
                        </Box>
                        <Box wrap direction="row">
                            <Box flex="grow">
                                <Select onChange={this.updateBenRelation} id={value + '-rel'} name={value + '-rel'} value={this.state[value + '-rel'].name} options={relations} children={(option) => {return <Box margin="small">{option.name}</Box>}} placeholder="Relationship"/>
                            </Box>
                            <span className="hideOnXSmallScreens" style={{width: 10}}/>
                            <div className="showOnXSmallScreens"/>
                            <Box flex="grow">
                                <TextInput id={value + '-share'}
                                           name={value + '-share'}
                                           value={this.state[value + '-share']}
                                           onChange={this.updateBenInfo}
                                           type="number"
                                           placeholder="Percentage of Payout"/>
                            </Box>
                        </Box>
                        <Box gap="small" flex="grow" justify="end" direction="row">
                            <Button onClick={() => this.deleteBeneficiary(value)} label={"Delete"}/>
                        </Box>
                    </Box>
                </Box>
            );
        });
    };

    render = () => {
        return(
            <Box>
                {this.displayBeneficiaries()}
                <Box fill="vertical" align="center" justify="center">
                <Button onClick={this.addBeneficiary} className="addBenButton" plain label="Add Another Beneficiary" round="small" margin="small" align="center" fill/>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(BeneficiaryList);