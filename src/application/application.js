import React, { Component } from 'react';
import Store from '../ApplicationStore';
import * as qs from 'query-string';
import {
    Anchor,
    Box,
    Button,
    CheckBox,
    FormField,
    Heading,
    MaskedInput,
    RadioButton,
    Select,
    Text,
    TextInput
} from "grommet";
import countries from './country-by-abbreviation';
import states from './states.json';

class Application extends Component {

    state = {
        fname: '',
        lname: '',
        birthCountry: '',
        ssn: '',
        hasDl: true,
        dlNum: '',
        email: '',
        pPhoneNum: '',
        freq: 'month'
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
        else v = v.toUpperCase();
        this.setState({dlNum: v});
    };

    updateEmail = event => {
        this.setState({email: event.target.value});
    };

    updatePPhoneNum = event => {
        this.setState({pPhoneNum: event.target.value});
    };

    updateFreq = event => {
        this.setState({freq: event.target.name});
    };

    submitApplication = () => {
        console.log('submitted (jk not yet - 1/18/19)');
    };

    getPaymentByTerm = () => {
        let { freq } = this.state;
        let quote = this.props.store.get('quote');
        if(quote === undefined) return '';
        if(typeof quote === 'string') quote = JSON.parse(quote);

        switch (freq) {
            case "quarter":
                return quote.quarterlyTotalPremium + "/QTR";
            case "semiannual":
                return quote.semiAnnualTotalPremium + "/SA";
            case "annual":
                return quote.annualTotalPremium + "/YR";
            case "month":
            default:
                return quote.monthlyTotalPremium + "/MO";
        }
    };

    componentDidMount = () => {
        document.title = "Application | INSUQO";
    };

    render = () => {
        const { ssn, hasDl, dlNum, email, pPhoneNum, freq } = this.state;
        // noinspection ConstantConditionalExpressionJS
        return(
            <Box fill align="center">
                <Box style={{maxWidth: 800}} justify="start" margin="small">
                    {false ? JSON.stringify(qs.parse(this.props.location.search, {ignoreQueryPrefix: true})) : ""}
                    <Heading margin="xsmall" color="black">We're Almost There.</Heading>
                    <Heading margin="xsmall" color="gray" level={2}>We just need a few more things to get you covered.</Heading>
                    <Box justify="start" className="formContent" gap="xsmall">
                        <Heading margin="xsmall" color="black" level={3}>Personal Info</Heading>
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
                                <Select placeholder="United States" options={countries} children={(option) => {return <Box margin="small">{option.country}</Box>}}/>
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
                            <Box style={{backgroundColor: '#efecff', padding: 20}}>
                                <CheckBox onChange={this.updateHasDl} checked={hasDl} label={<Box>I have a valid driver's license.</Box>}/>
                                {!hasDl ? "" :
                                    <Box margin="small">
                                        <Heading margin="xsmall" color="black" level={3}>Driver's License</Heading>
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
                        <Box>
                            <Heading margin="xsmall" color="black" level={3}>Address</Heading>
                            <Box>
                                <FormField label="Street Address">
                                    <TextInput placeholder="123 Mulberry Lane"/>
                                </FormField>
                                <FormField label="Apartment/Unit (Address Line 2)">
                                    <TextInput placeholder="10B"/>
                                </FormField>
                                <Box align="left">
                                    <Box wrap justify="left" align="center" margin="none" direction="row" gap="small">
                                        <Text color="#999" size="large" weight="bold">Redwood City,</Text>
                                        <Text color="#999" size="large" weight="bold">California</Text>
                                        <Text color="#999" size="large" weight="bold">94061</Text>
                                        <Anchor size="small">Why can't I change my city?</Anchor>
                                    </Box>

                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Heading margin="xsmall" color="black" level={3}>Contact Info</Heading>
                            <FormField label="Email Address">
                                <MaskedInput
                                    mask={[
                                        {
                                            regexp: /^[\w-.]*$/,
                                            placeholder: "person"
                                        },
                                        { fixed: "@" },
                                        {
                                            regexp: /^[\w-]*$/,
                                            placeholder: "example"
                                        },
                                        { fixed: "." },
                                        {
                                            regexp: /^[\w-]{1,4}$/,
                                            placeholder: "com"
                                        }
                                    ]}
                                    value={email}
                                    onChange={this.updateEmail}
                                />
                            </FormField>
                            <FormField label="Primary Phone Number">
                                <MaskedInput
                                    mask={[
                                        { fixed: '('},
                                        {
                                            regexp: /^[0-9]{1,3}$/,
                                            placeholder: "123"
                                        },
                                        { fixed: ')'},
                                        { fixed: ' '},
                                        {
                                            regexp: /^[0-9]{1,3}$/,
                                            placeholder: "456"
                                        },
                                        { fixed: '-'},
                                        {
                                            regexp: /^[0-9]{1,4}$/,
                                            placeholder: '7890'
                                        }
                                    ]}
                                    value={pPhoneNum}
                                    onChange={this.updatePPhoneNum}
                                />
                            </FormField>
                        </Box>
                    </Box>
                    <Box>
                        <Heading margin="xsmall" level={2}>Plan Info</Heading>
                        <Box margin="xsmall">
                            <Heading margin="none" level={3}>Beneficiaries</Heading>
                            <Heading margin="none" color="gray" level={4}>Who is covered if the plan goes into effect?</Heading>
                            // todo implement
                        </Box>
                        <Box margin="xsmall">
                            <Heading margin="none" level={3}>Payment Frequency</Heading>
                            <Heading margin="none" level={4}><Anchor href="#">Help me choose!</Anchor></Heading>
                            <Box direction="row">
                                <Box fill margin="small" gap="small">
                                    <RadioButton checked={freq === 'month'} onChange={this.updateFreq} name="month" label="Monthly"/>
                                    <RadioButton checked={freq === 'quarter'} onChange={this.updateFreq} name="quarter" label="Quarterly"/>
                                    <RadioButton checked={freq === 'semiannual'} onChange={this.updateFreq} name="semiannual" label="Semi-Annually"/>
                                    <RadioButton checked={freq === 'annual'} onChange={this.updateFreq} name="annual" label="Annually"/>
                                </Box>
                                <Box align="center" justify="center" fill style={{backgroundColor: '#efecff', height: 'auto'}}>
                                    <Heading color="#9c37f2">${this.getPaymentByTerm()}</Heading>
                                </Box>
                            </Box>
                        </Box>
                        <Box margin="xsmall">
                            <Heading margin="none" level={3}>Other Information</Heading>
                            <Text>Please check any of the following, if they apply to you.</Text>
                            <Box margin="xsmall" fill gap="small">
                                <CheckBox label={<Box>I currently have another life insurance plan.</Box>}/>
                                <CheckBox label={<Box>This policy will replace or change my other policy.</Box>}/>
                                <CheckBox label={<Box>I currently have another application pending with another insurance company.</Box>}/>
                                <CheckBox label={<Box>A previous application has been declined, postponed, or modified after applying.</Box>}/>
                                <CheckBox label={<Box>Another party, besides me, will obtain a right, title, or interest in any policy issued on the life of the proposed insured as a result of this application.</Box>}/>
                            </Box>
                        </Box>
                    </Box>
                    <Button primary label="Submit Application" onClick={this.submitApplication}/>
                </Box>
            </Box>
        );
    };
}

export default Store.withStore(Application);