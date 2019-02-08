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
    Text,
    TextInput
} from "grommet";
import countries from './country-by-abbreviation';
import states from './states.json';
import BeneficiaryList from "./beneficiary-list";
import {newApplication} from "../api";

class Application extends Component {

    state = {
        fname: '',
        lname: '',
        birthCountry: 'United States',
        birthCountryCode: 'US',
        ssn: '',
        hasDl: true,
        dlNum: '',
        dlState: 'Alabama',
        dlStateCode: 'AL',
        addrLine1: '',
        addrLine2: '',
        email: '',
        pPhoneNum: '',
        freq: 'month',
        otherLifeInsurance: false,
        oiWillReplace: false,
        oiPending: false,
        oiModified: false,
        intendedParty: false,
        willFinance: false,
        willLiquidate: false,
        fnameError: false,
        lnameError: false,
        ssError: false
    };

    updateOtherLifeInsurance = event => {
        this.setState({[event.target.name]: !this.state[event.target.name]});
    };

    updateFname = event => {
        this.setState({fname: event.target.value, fnameError: false});
    };

    blurFname = event => {
        if(event.target.value.length < 2) {
            this.setState({fnameError: true})
        } else {
            this.setState({fnameError: false})
        }
    };

    updateLname = event => {
        this.setState({lname: event.target.value, lnameError: false});
    };

    blurLname = event => {
        if(event.target.value.length < 2) {
            this.setState({lnameError: true})
        } else {
            this.setState({lnameError: false})
        }
    };

    updateBirthCountry = event => {
        console.log(event.target.value);
        this.setState({birthCountryCode: event.target.value});
    };

    updateSsn = event => {
        this.setState({ssn: event.target.value});
    };

    blurSsn = event => {
        console.log(event.target.value);
        if(event.target.value.length < 12) {
            this.setState({ssError: true})
        } else {
            this.setState({ssError: false})
        }
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

    updateDlState = event => {
        this.setState({dlStateCode: event.target.value});
    };

    updateAddrLine1 = event => {
        this.setState({addrLine1: event.target.value})
    };

    updateAddrLine2 = event => {
        this.setState({addrLine2: event.target.value})
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
        const store = this.props.store;
        newApplication({
            ...this.state,
            birthCountry: undefined,
            dlState: undefined,
            addrCity: store.get('city'),
            addrState: store.get('stateCode'),
            addrZip: store.get('zipCode'),
            covAmount: store.get('quote').faceAmount,
            rider: store.get('rider'),
            termLength: store.get('quote').term,
            carrierID: store.get('quote').companyID
        });
    };

    updateBens = (id, obj) => {
        console.log(id, obj);
        this.setState({['ben-' + id]: obj})
    };

    getPaymentByTerm = () => {
        let { freq } = this.state;
        let quote = this.props.store.get('quote');
        if(quote === undefined) return '';
        if(typeof quote === 'string') {quote = JSON.parse(quote);}

        switch (freq) {
            case "quarter":
                return parseFloat(quote.quarterlyTotalPremium).toFixed(2);
            case "semiannual":
                return parseFloat(quote.semiAnnualTotalPremium).toFixed(2);
            case "annual":
                return parseFloat(quote.annualTotalPremium).toFixed(2);
            case "month":
            default:
                return parseFloat(quote.monthlyTotalPremium).toFixed(2);
        }
    };

    getPaymentTerm = () => {
        let { freq } = this.state;

        switch (freq) {
            case "quarter":
                return '3 months';
            case "semiannual":
                return '6 months';
            case "annual":
                return "12 months";
            case "month":
            default:
                return "month";
        }
    };

    componentDidMount = () => {
        document.title = "Application | INSUQO";
    };

    render = () => {
        const {
            fname,
            lname,
            ssn,
            hasDl,
            dlNum,
            dlStateCode,
            email,
            pPhoneNum,
            freq,
            otherLifeInsurance,
            oiPending,
            oiModified,
            oiWillReplace,
            willFinance,
            willLiquidate,
            intendedParty,
            addrLine1,
            birthCountryCode,
            addrLine2,
            fnameError,
            lnameError,
            ssError
        } = this.state;
        // noinspection ConstantConditionalExpressionJS
        return(
            <Box fill align="center">
                <Box style={{maxWidth: 800}} justify="start" margin="small">
                    {false ? JSON.stringify(qs.parse(this.props.location.search, {ignoreQueryPrefix: true})) : ""}
                    <Heading margin="xsmall" color="black">You're Almost There.</Heading>
                    <Heading margin="xsmall" className="purpleText" level={2}>We just need a few more things to get you on your way.</Heading>
                    <Box justify="start" className="formContent" gap="xsmall">
                        <Heading margin="xsmall" color="black" level={3}>Personal Info</Heading>
                        <Box className="nameSection"  gap="small">
                            <FormField label="First Name" error={fnameError ? "First name must be longer than 2 characters." : undefined}>
                                <TextInput value={fname} onBlur={this.blurFname} onChange={this.updateFname} placeholder="John"/>
                            </FormField>
                            <FormField label="Last Name" error={lnameError ? "Last name must be longer than 2 characters." : undefined}>
                                <TextInput value={lname} onBlur={this.blurLname} onChange={this.updateLname} placeholder="Smith"/>
                            </FormField>
                        </Box>
                        <Heading margin="xsmall" color="black" level={3}>Citizenship</Heading>
                        <Box gap="small" className="citizenshipSection">
                            <FormField label="Country of Birth">
                                <select className="bc-select" onChange={this.updateBirthCountry} value={birthCountryCode} placeholder="United States" children={countries.map(option => <option value={option.abbreviation}>{option.country}</option>)}/>
                            </FormField>
                            <FormField label="Social Security Number"
                                       help="We are required to use this for validation purposes."
                                       error={ssError ? "Please input a valid social security number." : undefined}>
                                <MaskedInput mask={[
                                    { // todo - replace with Cleave
                                        length: 3,
                                        regexp: /^[0-9]{1,3}$/,
                                        placeholder: 'XXX'
                                    },
                                    {
                                        fixed: '-'
                                    },
                                    {
                                        length: 2,
                                        regexp: /^[0-9]{1,2}$/,
                                        placeholder: 'XX'
                                    },
                                    {
                                        fixed: '-'
                                    },
                                    {
                                        length: 4,
                                        regexp: /^[0-9]{1,4}$/,
                                        placeholder: 'XXXX'
                                    }
                                ]}
                                value={ssn}
                                onChange={this.updateSsn}
                                />
                            </FormField>
                            <Box style={{backgroundColor: '#efecff', padding: 20}}>
                                <CheckBox onChange={this.updateHasDl} checked={hasDl} label={<Box>I have a valid driver's license.</Box>}/>
                                {!hasDl ? "" :
                                    <Box margin="small">
                                        <Heading margin="xsmall" color="black" level={3}>Driver's License</Heading>
                                        <FormField label="Registered State">
                                            <select className="dls-select" value={dlStateCode} onChange={this.updateDlState} placeholder="California" children={states.map(option => <option value={option.abbreviation}>{option.name}</option>)}/>
                                        </FormField>
                                        <FormField label="License Number">
                                            <MaskedInput mask={[ // todo - replace with cleave
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
                                    <TextInput value={addrLine1} onChange={this.updateAddrLine1} placeholder="123 Mulberry Lane"/>
                                </FormField>
                                <FormField label="Apartment/Unit (Address Line 2)">
                                    <TextInput value={addrLine2} onChange={this.updateAddrLine2} placeholder="10B"/>
                                </FormField>
                                <Box align="start">
                                    <Box wrap justify="start" align="center" margin="none" direction="row" gap="small">
                                        <Text color="#999" size="large" weight="bold">{this.props.store.get('city')},</Text>
                                        <Text color="#999" size="large" weight="bold">{this.props.store.get('stateName')}</Text>
                                        <Text color="#999" size="large" weight="bold">{this.props.store.get('zipCode')}</Text>
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
                            <BeneficiaryList onUpdate={this.updateBens}/>
                        </Box>
                        <Box margin="xsmall">
                            <Heading margin="none" level={3}>Payment Frequency</Heading>
                            <Heading margin="none" level={4}><Anchor className="purpleText" href="#">Help me choose!</Anchor></Heading>
                            <Box direction="row">
                                <Box fill margin="small" gap="small">
                                    <RadioButton checked={freq === 'month'} onChange={this.updateFreq} name="month" label="Monthly"/>
                                    <RadioButton checked={freq === 'quarter'} onChange={this.updateFreq} name="quarter" label="Quarterly"/>
                                    <RadioButton checked={freq === 'semiannual'} onChange={this.updateFreq} name="semiannual" label="Semi-Annually"/>
                                    <RadioButton checked={freq === 'annual'} onChange={this.updateFreq} name="annual" label="Annually"/>
                                </Box>
                                <Box align="center" justify="center" fill style={{backgroundColor: '#efecff', height: 'auto'}}>
                                    <Heading margin="none" color="#9c37f2">${this.getPaymentByTerm()}</Heading>
                                    <Text className="purpleText">every <b>{this.getPaymentTerm()}</b></Text>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={{backgroundColor: '#FAFAFA', marginBottom: 20, padding: 20}} margin="xsmall">
                            <Heading margin="none" level={3}>Other Information</Heading>
                            <Text>Please select any of the following options <b>only</b> if they apply to you.</Text>
                            <Box margin="xsmall" fill gap="small">
                                <CheckBox name="otherLifeInsurance" checked={otherLifeInsurance} onChange={this.updateOtherLifeInsurance} label={<Box>I currently have another life insurance plan.</Box>}/>
                                <CheckBox name="oiWillReplace" checked={oiWillReplace} onChange={this.updateOtherLifeInsurance} label={<Box>This policy will replace or change my other policy.</Box>}/>
                                <CheckBox name="oiPending" checked={oiPending} onChange={this.updateOtherLifeInsurance} label={<Box>I currently have another application pending with another insurance company.</Box>}/>
                                <CheckBox name="oiModified" checked={oiModified} onChange={this.updateOtherLifeInsurance} label={<Box>A previous application has been declined, postponed, or modified after applying.</Box>}/>
                                <CheckBox name="intendedParty" checked={intendedParty} onChange={this.updateOtherLifeInsurance} label={<Box>Another party, besides me, will obtain a right, title, or interest in any policy issued on the life of the proposed insured as a result of this application.</Box>}/>
                                <CheckBox name="willFinance" checked={willFinance} onChange={this.updateOtherLifeInsurance} label={<Box>I will be taking out a loan or financing my premiums for this plan.</Box>}/>
                                <CheckBox name="willLiquidate" checked={willLiquidate} onChange={this.updateOtherLifeInsurance} label={<Box>This policy will be replaced through a 1035 exchange or liquidation.</Box>}/>
                            </Box>
                        </Box>
                    </Box>
                    <Button primary className="purpleBackground purpleOutline" label="Submit Application" onClick={this.submitApplication}/>
                </Box>
            </Box>
        );
    };
}

export default Store.withStore(Application);