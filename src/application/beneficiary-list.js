import React, { Component } from 'react';
import Store from '../ApplicationStore';
import {Box, Button, Heading, Select, TextInput} from "grommet/es6";
import {identity} from "rxjs";
import {makeid} from '../func';
import relations from './relations';

class BeneficiaryList extends Component {

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
            [id + '-rel']: '',
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
    };

    updateBenRelation = event => {
        this.setState({[event.target.name]: event.value});
    };

    componentDidMount = () => {
        this.addBeneficiary();
    };

    displayBeneficiaries = () => {
        const { beneficiaries } = this.state;
        return beneficiaries.map((value, index) => {
            return(
                <Box margin={{top: 'small', bottom: 'small'}} key={value} pad="small" elevation="small" round="small" gap="small" fill="horizontal">
                    <Box fill wrap gap="small">
                        <Heading margin="xxsmall" level={3}>Beneficiary {index + 1}</Heading>
                        <Box gap="small" direction="row">
                            <TextInput id={value + '-fname'}
                                       name={value + '-fname'}
                                       value={this.state[value + '-fname']}
                                       onChange={this.updateBenInfo}
                                       placeholder="First Name"/>
                            <Box width="small">
                                <TextInput id={value + '-middleI'}
                                           name={value + '-middleI'}
                                           value={this.state[value + '-middleI']}
                                           onChange={this.updateBenInfo}
                                           placeholder="Middle Initial"/>
                            </Box>
                            <TextInput id={value + '-lname'}
                                       name={value + '-lname'}
                                       value={this.state[value + '-lname']}
                                       onChange={this.updateBenInfo}
                                       placeholder="Last Name"/>
                        </Box>
                        <Box gap="small" direction="row">
                            <Box fill>
                                <Select onChange={this.updateBenRelation} id={value + '-rel'} name={value + '-rel'} value={this.state[value + '-rel'].name} options={relations} children={(option) => {return <Box margin="small">{option.name}</Box>}} placeholder="Relationship"/>
                            </Box>
                            <TextInput id={value + '-share'}
                                       name={value + '-share'}
                                       value={this.state[value + '-share']}
                                       onChange={this.updateBenInfo}
                                       type="number"
                                       placeholder="Percentage of Payout"/>
                        </Box>
                        <Box gap="small" fill="horizontal" justify="end" direction="row">
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