import React, {Component} from 'react';
import Store from '../../ApplicationStore';
import {Text} from 'grommet';
import {newApplication} from '../../api';
import {Modal} from 'antd';
import {validateEmail} from '../../func';
import {ApplicationBasicInfo} from "../../components/application/ApplicationBasicInfo/ApplicationBasicInfo";
import {QuickTermQuoteResult} from "insuqo-shared";

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
    //
    // updateValue = (key, value) => {
    //     this.applicationData[key] = value;
    // };
    //
    //
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

    componentDidMount = () => {
        document.title = 'Application | INSUQO';
    };

    render = () => {
        return (
            <>
                <ApplicationBasicInfo chosenQuote={{
                    MonthlyTotalPremium: 145.38,
                    QuarterlyTotalPremium: 145.38 * 4,
                    SemiAnnualTotalPremium: 145.38 * 6,
                    AnnualTotalPremium: 145.38 * 12,
                } as any}/>
            </>
        );
    };
}

export default Store.withStore(Application as any);
// disabled={!fnameValid || !lnameValid || !ssValid || !pPhoneValid || !emailValid}
