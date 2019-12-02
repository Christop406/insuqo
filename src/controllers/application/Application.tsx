import React, {Component} from 'react';
import Store from '../../ApplicationStore';
import {Text} from 'grommet';
import {newApplication} from '../../api';
import {Modal} from 'antd';
import {validateEmail} from '../../func';
import {ApplicationBasicInfo} from "../../components/application/ApplicationBasicInfo/ApplicationBasicInfo";

class Application extends Component {
    //
    // applicationData = {
    //     firstName: '',
    //     beneficiaries: [],
    //     middleInitial: '',
    //     lastName: '',
    //     countryOfBirth: 'US',
    //     ssn: '',
    //     idNum: '',
    //     idState: 'Alabama',
    //     dlStateCode: 'AL',
    //     addrLine1: '',
    //     addrLine2: '',
    //     primaryEmail: '',
    //     primaryPhone: '',
    // };
    //
    // state = {
    //     hasDl: true,
    //     fnameError: false,
    //     lnameError: false,
    //     ssError: false,
    //     pPhoneError: false,
    //     emailError: false,
    //     fnameValid: false,
    //     lnameValid: false,
    //     ssValid: false,
    //     pPhoneValid: false,
    //     emailValid: false,
    //     otherLifeInsurance: false,
    //     oiWillReplace: false,
    //     oiPending: false,
    //     oiModified: false,
    //     intendedParty: false,
    //     willFinance: false,
    //     willLiquidate: false,
    //     freq: 'month',
    //
    // };
    //
    // updateOtherLifeInsurance = event => {
    //     this.setState({[event.target.name]: !this.state[event.target.name]});
    // };
    //
    // blurFname = event => {
    //     this.setState({fnameError: event.target.value.length < 2});
    // };
    //
    //
    // blurLname = event => {
    //     this.setState({lnameError: event.target.value.length < 2});
    // };
    //
    // blurSsn = event => {
    //     this.setState({ssError: event.target.value.length < 11});
    // };
    //
    // blurEmail = event => {
    //     if (validateEmail(event.target.value)) {
    //         this.setState({emailError: false});
    //     } else {
    //         this.setState({emailError: true});
    //     }
    // };
    //
    // updatePPhoneNum = event => {
    //     this.setState({
    //         pPhoneNum: event.target.value,
    //         pPhoneError: false,
    //         pPhoneValid: event.target.value.length >= 10
    //     });
    // };
    //
    // blurPPhoneNum = event => {
    //     this.setState({pPhoneError: event.target.rawValue.length < 10});
    // };
    //
    // updateFreq = event => {
    //     this.setState({freq: event.target.name});
    // };
    //
    // updateValue = (key, value) => {
    //     this.applicationData[key] = value;
    // };
    //
    // showCityReasoning = () => {
    //     Modal.info({
    //         title: 'Why can\'t I change my city/state?',
    //         content: <Text>We do not allow you to change your city or state because a change in this information
    //             may affect your quoted amount.<br/><br/>If you would like to change your address, please re-run our
    //             quoting tool with your correct address.</Text>,
    //         centered: true
    //     });
    // };
    //
    // showFreqInfo = () => {
    //     Modal.info({
    //         title: 'Why the different prices?',
    //         content: <Text justify="stretch">A lot like any other kind of subscription,
    //             a vendor will reward up-front payment with a discounted rate.
    //             It is the same for life insurance. If you decide to pay on
    //             an annual pay schedule, your overall rate will be somewhat lower
    //             than on a monthly schedule.<br/><br/>
    //             To see the different rates, click each radio button to change your payment frequency.
    //         </Text>,
    //         centered: true
    //     });
    // };
    //
    // showConfirm = () => {
    //     // eslint-disable-next-line @typescript-eslint/no-this-alias
    //     const that = this;
    //     Modal.confirm({
    //         title: 'You are about to apply for life insurance',
    //         content: <Text>Please ensure all of your information is correct.
    //             If anything needs to be changed, please click <b>Cancel</b> and try again.</Text>,
    //         onOk() {
    //             that.submitApplication();
    //         },
    //         onCancel() {
    //             console.log('Cancelled');
    //         },
    //         centered: true,
    //     });
    // };
    //
    // submitApplication = () => {
    //     const store = this.props.store;
    //     const {otherLifeInsurance, oiWillReplace, oiPending, oiModified, intendedParty, willFinance, willLiquidate, freq} = this.state;
    //     const quote = store.get('quote');
    //     newApplication({
    //         ...this.applicationData,
    //         otherLifeInsurance: otherLifeInsurance,
    //         otherInsuranceWillReplace: oiWillReplace,
    //         otherInsurancePending: oiPending,
    //         otherInsuranceModified: oiModified,
    //         hasIntendedParty: intendedParty,
    //         willFinance,
    //         willLiquidate,
    //         paymentFrequency: freq,
    //         addrCity: store.get('city'),
    //         addrState: store.get('stateCode'),
    //         addrZipCode: store.get('zipCode'),
    //         rider: store.get('rider'),
    //         birthDate: store.get('birthdate'),
    //         quote: quote
    //     }).then(response => {
    //         if (response.status === 201 || response.status === 200) {
    //             localStorage.setItem('app_id', response.data.sk);
    //             this.props.history.push(`/application/status?id=${response.data.sk}`);
    //         }
    //     });
    // };
    //
    // updateBens = (benObj) => {
    //     this.applicationData.beneficiaries = benObj;
    //     console.log(this.applicationData);
    // };
    //
    // getPaymentByTerm = () => {
    //     const {freq} = this.state;
    //     let quote = this.props.store.get('quote');
    //     if (quote === undefined) return '';
    //     if (typeof quote === 'string') {
    //         quote = JSON.parse(quote);
    //     }
    //
    //     switch (freq) {
    //         case 'quarter':
    //             return parseFloat(quote.QuarterlyTotalPremium).toFixed(2);
    //         case 'semiannual':
    //             return parseFloat(quote.SemiAnnualTotalPremium).toFixed(2);
    //         case 'annual':
    //             return parseFloat(quote.AnnualTotalPremium).toFixed(2);
    //         case 'month':
    //         default:
    //             return parseFloat(quote.MonthlyTotalPremium).toFixed(2);
    //     }
    // };

    // getPaymentTerm = () => {
    //     const {freq} = this.state;
    //
    //     switch (freq) {
    //         case 'quarter':
    //             return '3 months';
    //         case 'semiannual':
    //             return '6 months';
    //         case 'annual':
    //             return '12 months';
    //         case 'month':
    //         default:
    //             return 'month';
    //     }
    // };

    componentDidMount = () => {
        document.title = 'Application | INSUQO';
    };

    render = () => {
        return (
            <>
                <ApplicationBasicInfo/>
            </>
        );
    };
}

export default Store.withStore(Application as any);
// disabled={!fnameValid || !lnameValid || !ssValid || !pPhoneValid || !emailValid}
