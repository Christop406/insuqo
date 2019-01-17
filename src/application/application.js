/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Component } from 'react';
import Store from '../ApplicationStore';
import * as qs from 'query-string';
import {Box, CheckBox, FormField, Heading, MaskedInput, Select, TextInput} from "grommet";
import countries from './country-by-abbreviation';
import states from './states.json';

class Application extends Component {

    state = {
        fname: '',
        lname: '',
        birthCountry: '',
        ssn: '',
        hasDl: true,
        dlNum: ''
    };

    updateSsn = event => {
        this.setState({ssn: event.target.value});
    };

    updateHasDl = event => {
        this.setState({hasDl: event.target.checked})
    };

    updateDlNum = event => {
        let v = event.target.value;
        if(v === undefined) v = '';
        else v = v.toUpperCase()
        this.setState({dlNum: v});
    };

    componentDidMount = () => {
        document.title = "Application | INSUQO";
    };

    render = () => {
        // noinspection ConstantConditionalExpressionJS
        const { ssn, hasDl, dlNum } = this.state;
        return(
            <Box style={{height: 'auto !important'}} justify="start" margin="small">
                {true ? "" : JSON.stringify(qs.parse(this.props.location.search, {ignoreQueryPrefix: true}))}
                <Heading margin="xsmall" color="black">We're Almost There.</Heading>
                <Heading margin="xsmall" color="gray" level={2}>We just need a few more things to get you covered.</Heading>
                <Box justify="start" className="formContent" gap="xsmall">
                    <Heading margin="xsmall" color="black" level={2}>Personal Info</Heading>
                    <Box className="nameSection"  gap="small">
                        <FormField label="First Name">
                            <TextInput placeholder="John"/>
                        </FormField>
                        <FormField label="Last Name">
                            <TextInput placeholder="Smith"/>
                        </FormField>
                    </Box>
                    <Heading margin="xsmall" color="black" level={3}>Citizenship</Heading>
                    <Box gap="small" className="citizenshipSection">
                        <FormField label="Country of Birth">
                            <Select placeholder="United States" options={countries} children={(option) => {return <div style={{height: 40}}>{option.country}</div>}}/>
                        </FormField>
                        <FormField label="Social Security Number" help="We are required to use this for validation purposes.">
                            <MaskedInput mask={[
                                {
                                    length: 3,
                                    regexp: /^[0-9]{1,3}$/,
                                    placeholder: 'XXX'
                                },
                                {
                                    fixed: ' '
                                },
                                {
                                    length: 2,
                                    regexp: /^[0-9]{1,2}$/,
                                    placeholder: 'XX'
                                },
                                {
                                    fixed: ' '
                                },
                                {
                                    length: 4,
                                    regexp: /^[0-9]{1,4}$/,
                                    placeholder: 'XXXX'
                                }
                            ]}
                            value={ssn}
                            onChange={this.updateSsn}/>
                        </FormField>
                        <CheckBox onChange={this.updateHasDl} checked={hasDl} label={<Box>I have a valid driver's license.</Box>}/>
                        {!hasDl ? "" :
                            <Box>
                                <FormField label="Registered State">
                                    <Select placeholder="California" options={states} children={(option) => {return <div style={{height: 40}}>{option.name}</div>}}/>
                                </FormField>
                                <FormField label="License Number">
                                    <MaskedInput mask={[
                                        {
                                        length: 8,
                                        regexp: /^[a-zA-Z0-9]{1,8}$/}
                                    ]}
                                    value={dlNum}
                                    onChange={this.updateDlNum}
                                    placeholder="F870684"/>
                                </FormField>
                            </Box>
                        }
                    </Box>
                </Box>
            </Box>
        );
    };
}

export default Store.withStore(Application);