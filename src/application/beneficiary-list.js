import React, { Component } from 'react';
import Store from '../ApplicationStore';
import {Box, Button, Heading, Select, TextInput} from "grommet/es6";
import {identity} from "rxjs";

class BeneficiaryList extends Component {

    state = {
        beneficiaries: [],
        idCounter: 0
    };

    addBeneficiary = () => {

        console.log('adding ben');

        let emptyBen = {
            fname: '',
            mname: '',
            lname: '',
            relationship: '',
            percentage: 0,
            id: this.state.idCounter
        };

        this.setState(prevState => ({
            beneficiaries: [...prevState.beneficiaries, emptyBen],
            idCounter: this.state.idCounter + 1
        }));
    };

    deleteBeneficiary = id => {
        console.log('deleting', id);
        this.setState(prevState => ({beneficiaries: prevState.beneficiaries.filter((ben, ind) => {
            if(ben.id === id) {
                return false;
            }
            console.log(ind, id);
            return true;
        })}))
    };

    componentDidMount = () => {
        this.addBeneficiary();
    };

    displayBeneficiaries = () => {
        const { beneficiaries } = this.state;
        return beneficiaries.map((value, index) => {
            return(
                <Box margin={{top: 'small', bottom: 'small'}} pad="small" elevation="small" round="small" gap="small" fill="horizontal">
                    <Box fill wrap gap="small">
                        <Heading margin="xxsmall" level={3}>Beneficiary {index + 1}</Heading>
                        <Box gap="small" direction="row">
                            <TextInput placeholder="First Name"/>
                            <Box width="small">
                                <TextInput placeholder="Middle Initial"/>
                            </Box>
                            <TextInput placeholder="Last Name"/>
                        </Box>
                        <Box gap="small" direction="row">
                            <Box fill>
                                <Select placeholder="Relationship"/>
                            </Box>
                            <TextInput type="number" placeholder="Percentage of Payout"/>
                        </Box>
                        <Box gap="small" fill="horizontal" justify="end" direction="row">
                            <Button onClick={() => this.deleteBeneficiary(value.id)} label={"Delete"}/>
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
                <Button onClick={this.addBeneficiary} className="addBenButton" plain label="Add Another Beneficiary" round="small" margin="small" align="center" fill="horizontal"/>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(BeneficiaryList);