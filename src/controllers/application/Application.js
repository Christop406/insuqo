import React, {Component} from 'react';
import Store from '../../ApplicationStore';
import {
    Anchor,
    Box,
    Button,
    CheckBox,
    FormField,
    Heading,
    RadioButton,
    Text,
    TextInput
} from "grommet";
import countries from '../../util/country-by-abbreviation';
import {states} from 'insuqo-shared/constants';
import BeneficiaryList from "../../components/beneficiary-list/BeneficiaryList";
import {newApplication} from "../../api";
import {Modal} from "antd";
import Cleave from 'cleave.js/react'
import {validateEmail} from "../../func";
import constants from '../../util/constants';

class Application extends Component {

    applicationData = {
        firstName: '',
        beneficiaries: [],
        middleInitial: '',
        lastName: '',
        countryOfBirth: 'US',
        ssn: '',
        idNum: '',
        idState: 'Alabama',
        dlStateCode: 'AL',
        addrLine1: '',
        addrLine2: '',
        primaryEmail: '',
        primaryPhone: '',
    };

    state = {
        hasDl: true,
        fnameError: false,
        lnameError: false,
        ssError: false,
        pPhoneError: false,
        emailError: false,
        fnameValid: false,
        lnameValid: false,
        ssValid: false,
        pPhoneValid: false,
        emailValid: false,
        otherLifeInsurance: false,
        oiWillReplace: false,
        oiPending: false,
        oiModified: false,
        intendedParty: false,
        willFinance: false,
        willLiquidate: false,
        freq: 'month',

    };

    updateOtherLifeInsurance = event => {
        this.setState({[event.target.name]: !this.state[event.target.name]});
    };

    blurFname = event => {
        this.setState({fnameError: event.target.value.length < 2})
    };


    blurLname = event => {
        this.setState({lnameError: event.target.value.length < 2})
    };

    blurSsn = event => {
        this.setState({ssError: event.target.value.length < 11})
    };

    blurEmail = event => {
        if (validateEmail(event.target.value)) {
            this.setState({emailError: false})
        } else {
            this.setState({emailError: true})
        }
    };

    updatePPhoneNum = event => {
        this.setState({
            pPhoneNum: event.target.value,
            pPhoneError: false,
            pPhoneValid: event.target.value.length >= 10
        });
    };

    blurPPhoneNum = event => {
        this.setState({pPhoneError: event.target.rawValue.length < 10})
    };

    updateFreq = event => {
        this.setState({freq: event.target.name});
    };

    updateValue = (key, value) => {
        this.applicationData[key] = value;
    };

    showCityReasoning = () => {
        Modal.info({
            title: 'Why can\'t I change my city/state?',
            content: <Text>We do not allow you to change your city or state because a change in this information
                may affect your quoted amount.<br/><br/>If you would like to change your address, please re-run our
                quoting tool with your correct address.</Text>,
            centered: true
        });
    };

    showFreqInfo = () => {
        Modal.info({
            title: 'Why the different prices?',
            content: <Text justify="stretch">A lot like any other kind of subscription,
                a vendor will reward up-front payment with a discounted rate.
                It is the same for life insurance. If you decide to pay on
                an annual pay schedule, your overall rate will be somewhat lower
                than on a monthly schedule.<br/><br/>
                To see the different rates, click each radio button to change your payment frequency.
            </Text>,
            centered: true
        });
    };

    showConfirm = () => {
        let that = this;
        Modal.confirm({
            title: 'You are about to apply for life insurance',
            content: <Text>Please ensure all of your information is correct.
                If anything needs to be changed, please click <b>Cancel</b> and try again.</Text>,
            onOk() {
                that.submitApplication();
            },
            onCancel() {
                console.log('Cancelled');
            },
            centered: true,
        });
    };

    submitApplication = () => {
        const store = this.props.store;
        const { otherLifeInsurance, oiWillReplace, oiPending, oiModified, intendedParty, willFinance, willLiquidate, freq } = this.state;
        const quote = store.get('quote');
        newApplication({
            ...this.applicationData,
            otherLifeInsurance: otherLifeInsurance,
            otherInsuranceWillReplace: oiWillReplace,
            otherInsurancePending: oiPending,
            otherInsuranceModified: oiModified,
            hasIntendedParty: intendedParty,
            willFinance,
            willLiquidate,
            paymentFrequency: freq,
            addrCity: store.get('city'),
            addrState: store.get('stateCode'),
            addrZipCode: store.get('zipCode'),
            rider: store.get('rider'),
            birthDate: store.get('birthdate'),
            quote: quote
        }).then(response => {
            if (response.status === 201 || response.status === 200) {
                localStorage.setItem("app_id", response.data.sk);
                this.props.history.push('/application/status');
            }
        });
    };

    updateBens = (benObj) => {
        this.applicationData.beneficiaries = benObj;
        console.log(this.applicationData);
    };

    getPaymentByTerm = () => {
        let {freq} = this.state;
        let quote = this.props.store.get('quote');
        if (quote === undefined) return '';
        if (typeof quote === 'string') {
            quote = JSON.parse(quote);
        }

        switch (freq) {
            case "quarter":
                return parseFloat(quote.QuarterlyTotalPremium).toFixed(2);
            case "semiannual":
                return parseFloat(quote.SemiAnnualTotalPremium).toFixed(2);
            case "annual":
                return parseFloat(quote.AnnualTotalPremium).toFixed(2);
            case "month":
            default:
                return parseFloat(quote.MonthlyTotalPremium).toFixed(2);
        }
    };

    getPaymentTerm = () => {
        let {freq} = this.state;

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
            hasDl,
            dlStateCode,
            freq,
            otherLifeInsurance,
            oiPending,
            oiModified,
            oiWillReplace,
            willFinance,
            willLiquidate,
            intendedParty,
            addrLine1,
            addrLine2,
            fnameError,
            lnameError,
            ssError,
            pPhoneError,
            emailError,
            fnameValid,
            lnameValid,
            ssValid,
            pPhoneValid,
            emailValid
        } = this.state;
        return (
            <Box fill align="center">
                <Box style={{maxWidth: 800}} justify="start" margin="small">
                    <Heading margin="xsmall" color="black">Let's wrap this up.</Heading>
                    <Heading margin="xsmall" className="purpleText" level={2}>We just need a few more things to get you
                        on your way.</Heading>
                    <Box justify="start" className="formContent" gap="xsmall">
                        <Heading margin="xsmall" color="black" level={3}>Personal Info</Heading>
                        <Box className="nameSection" gap="small">
                            <FormField label="First Name"
                                       error={fnameError ? "First name must be longer than 2 characters." : undefined}>
                                <TextInput onBlur={this.blurFname}
                                           onChange={event => this.updateValue('firstName', event.target.value)}
                                           placeholder="John"/>
                            </FormField>
                            <FormField label="Last Name"
                                       error={lnameError ? "Last name must be longer than 2 characters." : undefined}>
                                <TextInput onBlur={this.blurLname}
                                           onChange={event => this.updateValue('lastName', event.target.value)}
                                           placeholder="Smith"/>
                            </FormField>
                        </Box>
                        <Heading margin="xsmall" color="black" level={3}>Citizenship</Heading>
                        <Box gap="small" className="citizenshipSection">
                            <FormField label="Country of Birth">
                                <Box>
                                    <select className="bc-select"
                                            onChange={event => this.updateValue('countryOfBirth', event.target.value)}
                                            placeholder="United States"
                                            children={countries.map((option, index) => <option key={index}
                                                                                               value={option.abbreviation}>{option.country}</option>)}/>
                                </Box>
                            </FormField>
                            <FormField label="Social Security Number"
                                       help="We are required to use this for validation purposes."
                                       error={ssError ? "Please input a valid social security number." : undefined}>
                                <Box>
                                    <Cleave placeholder="XXX-XX-XXXX"
                                            style={{
                                                borderWidth: 0,
                                                height: 46,
                                                padding: 11,
                                                fontWeight: 600,
                                                outline: 'none'
                                            }}
                                            onChange={event => this.updateValue('ssn', event.target.value)}
                                            onBlur={this.blurSsn}
                                            options={{
                                                numericOnly: true,
                                                delimiter: '-',
                                                blocks: [3, 2, 4]
                                            }}
                                    />
                                </Box>
                            </FormField>
                            <Box style={{backgroundColor: '#efecff', padding: 20}}>
                                <CheckBox checked={hasDl} onChange={event => this.setState({hasDl: event.target.checked})}
                                          label={<span>I have a valid driver's license.</span>}/>
                                {!hasDl ? "" :
                                    <Box margin="small">
                                        <Heading margin="xsmall" color="black" level={3}>Driver's License</Heading>
                                        <FormField label="Registered State">
                                            <Box>
                                                <select className="dls-select" value={dlStateCode}
                                                        onChange={event => this.updateValue('idState', event.target.value)}
                                                        placeholder="California"
                                                        children={states.map((option, index) => <option key={index}
                                                                                                        value={option.abbreviation}>{option.name}</option>)}/>
                                            </Box>
                                        </FormField>
                                        <FormField label="License Number">
                                            <Box>
                                                <Cleave
                                                    style={{
                                                        borderWidth: 0,
                                                        height: 46,
                                                        padding: 11,
                                                        fontWeight: 600,
                                                        outline: 'none',
                                                        backgroundColor: 'transparent'
                                                    }}
                                                    options={{
                                                        blocks: [8],
                                                        numericOnly: false,
                                                        uppercase: true
                                                    }}
                                                    onChange={event => this.updateValue('idNum', event.target.value || '')}
                                                    placeholder="F870684"/>
                                            </Box>
                                        </FormField>
                                    </Box>
                                }
                            </Box>
                        </Box>
                        <Box>
                            <Heading margin="xsmall" color="black" level={3}>Address</Heading>
                            <Box>
                                <FormField label="Street Address">
                                    <TextInput value={addrLine1}
                                               onChange={event => this.updateValue('addrLine1', event.target.value)}
                                               placeholder="123 Mulberry Lane"/>
                                </FormField>
                                <FormField label="Apartment/Unit (Address Line 2)">
                                    <TextInput value={addrLine2}
                                               onChange={event => this.updateValue('addrLine2', event.target.value)}
                                               placeholder="10B"/>
                                </FormField>
                                <Box align="start">
                                    <Box wrap justify="start" align="center" margin="none" direction="row" gap="small">
                                        <Text color="#999" size="large"
                                              weight="bold">{this.props.store.get('city')},</Text>
                                        <Text color="#999" size="large"
                                              weight="bold">{this.props.store.get('stateName')}</Text>
                                        <Text color="#999" size="large"
                                              weight="bold">{this.props.store.get('zipCode')}</Text>
                                        <Anchor onClick={this.showCityReasoning} size="small">Why can't I change my
                                            city?</Anchor>
                                    </Box>

                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Heading margin="xsmall" color="black" level={3}>Contact Info</Heading>
                            <FormField label="Email Address"
                                       error={emailError ? "Please input a valid email address." : undefined}
                            >
                                <TextInput
                                    placeholder="jsmith@example.com"
                                    onChange={event => this.updateValue('primaryEmail', event.target.value)}
                                    onBlur={this.blurEmail}
                                />
                            </FormField>
                            <FormField label="Primary Phone Number"
                                       error={pPhoneError ? "Please input a valid phone number." : undefined}
                            >
                                <Box>
                                    <Cleave placeholder="(123) 456-7890"
                                            style={{
                                                borderWidth: 0,
                                                height: 46,
                                                padding: 11,
                                                fontWeight: 600,
                                                outline: 'none'
                                            }}
                                            options={{
                                                numericOnly: true,
                                                blocks: [0, 3, 0, 3, 4],
                                                delimiters: ["(", ")", " ", "-"]
                                            }}
                                            onChange={event => this.updateValue('primaryPhone', event.target.value)}
                                            onBlur={this.blurPPhoneNum}
                                    />
                                </Box>
                            </FormField>
                        </Box>
                    </Box>
                    <Box>
                        <Heading margin="xsmall" level={2}>Plan Info</Heading>
                        <Box margin="xsmall">
                            <Heading margin="none" level={3}>Beneficiaries</Heading>
                            <Heading margin="none" color="gray" level={4}>Who is covered if the plan goes into
                                effect?</Heading>
                            <BeneficiaryList onUpdate={this.updateBens}/>
                        </Box>
                        <Box margin="xsmall">
                            <Heading margin="none" level={3}>Payment Frequency</Heading>
                            <Heading margin="none" level={4}><Anchor className="purpleText" onClick={this.showFreqInfo}>Help
                                me choose!</Anchor></Heading>
                            <Box direction="row">
                                <Box fill margin="small" gap="small">
                                    <RadioButton checked={freq === 'month'} onChange={this.updateFreq} name="month"
                                                 label="Monthly"/>
                                    <RadioButton checked={freq === 'quarter'} onChange={this.updateFreq} name="quarter"
                                                 label="Quarterly"/>
                                    <RadioButton checked={freq === 'semiannual'} onChange={this.updateFreq}
                                                 name="semiannual" label="Semi-Annually"/>
                                    <RadioButton checked={freq === 'annual'} onChange={this.updateFreq} name="annual"
                                                 label="Annually"/>
                                </Box>
                                <Box align="center" justify="center" fill
                                     style={{backgroundColor: '#efecff', height: 'auto'}}>
                                    <Heading margin="none"
                                             color={constants.colors.iqBrand}>${this.getPaymentByTerm()}</Heading>
                                    <Text className="purpleText">every <b>{this.getPaymentTerm()}</b></Text>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={{backgroundColor: '#FAFAFA', marginBottom: 20, padding: 20}} margin="xsmall">
                            <Heading margin="none" level={3}>Other Information</Heading>
                            <Text>Please select any of the following options <b>only</b> if they apply to you.</Text>
                            <Box margin="xsmall" fill gap="small">
                                <CheckBox name="otherLifeInsurance" checked={otherLifeInsurance}
                                          onChange={this.updateOtherLifeInsurance}
                                          label={<Box>I currently have another life insurance plan.</Box>}/>
                                <CheckBox name="oiWillReplace" checked={oiWillReplace}
                                          onChange={this.updateOtherLifeInsurance}
                                          label={<Box>This policy will replace or change my other policy.</Box>}/>
                                <CheckBox name="oiPending" checked={oiPending} onChange={this.updateOtherLifeInsurance}
                                          label={<Box>I currently have another application pending with another
                                              insurance company.</Box>}/>
                                <CheckBox name="oiModified" checked={oiModified}
                                          onChange={this.updateOtherLifeInsurance}
                                          label={<Box>A previous application has been declined, postponed, or modified
                                              after applying.</Box>}/>
                                <CheckBox name="intendedParty" checked={intendedParty}
                                          onChange={this.updateOtherLifeInsurance}
                                          label={<Box>Another party, besides me, will obtain a right, title, or interest
                                              in any policy issued on the life of the proposed insured as a result of
                                              this application.</Box>}/>
                                <CheckBox name="willFinance" checked={willFinance}
                                          onChange={this.updateOtherLifeInsurance}
                                          label={<Box>I will be taking out a loan or financing my premiums for this
                                              plan.</Box>}/>
                                <CheckBox name="willLiquidate" checked={willLiquidate}
                                          onChange={this.updateOtherLifeInsurance}
                                          label={<Box>This policy will be replaced through a 1035 exchange or
                                              liquidation.</Box>}/>
                            </Box>
                        </Box>
                    </Box>
                    <Button primary
                            className="purpleBackground purpleOutline" label="Submit Application"
                            onClick={this.showConfirm}/>
                </Box>
            </Box>
        );
    };
}

export default Store.withStore(Application);
// disabled={!fnameValid || !lnameValid || !ssValid || !pPhoneValid || !emailValid}
