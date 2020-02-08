import React, { Component } from 'react';
import Store from '../../../../ApplicationStore';
import Cleave from 'cleave.js/react';
import dayjs from 'dayjs';
import Modal from 'antd/es/modal';
import 'antd/es/modal/style/css';
import SmokingPopover from './smoking-popover';
import { Store as S } from 'undux';
import { History, LocationState } from 'history';
import classes from './personal.module.scss';
import { Checkbox } from '../../../forms/Checkbox/Checkbox';
import { RadioOption, RadioGroup } from '../../../forms/RadioGroup/RadioGroup';

interface IPersonalProps {
    store: S<any>;
    history: History<LocationState>;
}

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    },
    sexButtons: {
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 0
    }
};

class Personal extends Component<IPersonalProps> {

    state = {
        birthday: '',
        sex: 'none',
        tobacco: false,
        cannabis: false,
        bdError: false,
        bdErrMsg: '',
        sModalVisible: false
    };

    private sexOptions: RadioOption<string>[] = [
        { name: 'Male', value: 'male' },
        { name: 'Female', value: 'female' }
    ];

    updateBirthday = (event: any) => {
        console.log(event.target.value);
        const bd = dayjs(event.target.value, 'MM/DD/YYYY');
        const now = dayjs();
        const val = event.target.value;
        if (val.length > 8 && now.isBefore(bd)) {
            this.setState({ birthday: val, bdError: true, bdErrMsg: 'Please input a valid birthdate.' });
        } else if (val.length > 8 && now.subtract(18, 'year').isBefore(bd)) {
            this.setState({
                birthday: val,
                bdError: true,
                bdErrMsg: 'You must be 18 years or older to use this service.'
            });
        } else {
            this.setState({ birthday: val, bdError: false, bdErrMsg: '' });
        }
    };

    updateSex = (sex: string) => {
        this.setState({ sex });
    };

    updateTobacco = () => {
        const { tobacco } = this.state;
        this.setState({ tobacco: !tobacco });
    };

    updateCannabis = () => {
        const { cannabis } = this.state;
        this.setState({ cannabis: !cannabis });
    };

    validateBirthdate = () => {
        // todo - implement
        return true;
    };

    showSmokingModal = () => {
        Modal.info({
            title: 'Why we need your smoking habits',
            centered: true,
            content: <SmokingPopover />
        });
    };

    showGenderModal = () => {
        Modal.info({
            title: 'Why can I only choose male or female?',
            centered: true,
            content: <p>For insurance purposes, and estimation of quotes,
                we can only use either male or female. If you do not identify as
                    male or female, please use your sex at birth instead.</p>
        }
        );
    };

    submitPersonalInfo = () => {
        if (this.validateBirthdate()) {
            const store = this.props.store;
            const { birthday, sex, tobacco, cannabis } = this.state;
            store.set('birthdate')(dayjs(birthday, 'MM/DD/YYYY').format('YYYY-MM-DD'));
            store.set('sex')(sex);
            store.set('tobacco')(tobacco);
            store.set('cannabis')(cannabis);
            this.props.history.push('/quote/plan');
        }
    };

    componentDidMount = () => {
        window.scrollTo({top: 0});
        let bd = localStorage.getItem('birthdate');
        let sex = localStorage.getItem('sex');
        let tob: string | boolean | null = localStorage.getItem('tobacco');
        let can: string | boolean | null = localStorage.getItem('cannabis');
        if (bd == null || bd.length < 4) {
            bd = '';
        }
        if (sex == null || sex.length < 4) {
            sex = 'none';
        }
        if (tob == null) {
            tob = 'false';
        }
        if (can == null) {
            can = 'false';
        }

        tob = tob === 'true';
        can = can === 'true';

        this.setState({ birthday: bd, sex: sex, tobacco: tob, cannabis: can });

    };

    render = () => {
        const { store } = this.props;
        const { birthday, sex, bdError, bdErrMsg } = this.state;
        return (
            <div>
                <h1 className={classes.paneHeader} color="#9c37f2">The weather's fine
                    in {store.get('stateName') ? store.get('stateName') : 'XXXX'}!</h1>
                <h3 style={styles.quoteSubtitle}>(Because we've got you covered!)</h3>
                <p>
                    Before we can find quotes, we need to know a bit more about you as a person - let's start with your
                    age and sex.
                </p>
                <div className="qform-group">
                    <label className="qform-label" htmlFor="birthDate">Birthdate</label>
                    <div className={classes.birthdateContainer}>
                        <Cleave
                            name="birthDate"
                            style={{ borderColor: bdError ? '#f03434' : undefined }}
                            placeholder="MM/DD/YYYY"
                            className="input"
                            options={{ date: true, datePattern: ['m', 'd', 'Y'] }}
                            onChange={this.updateBirthday}
                            value={birthday}
                        />
                    </div>
                    {bdError ? <span className={classes.errorMessage}>{bdErrMsg}</span> : ''}
                </div>
                <div className="qform-group">
                    <label className="qform-label" htmlFor="sex">Sex</label>
                    <button className="button text text-primary" color="dark-4" onClick={this.showGenderModal}>Why are there only two options?</button>
                    <RadioGroup name="sex" value={sex} options={this.sexOptions} onChange={this.updateSex} />
                </div>
                <div className="qform-group">
                    <label className="qform-label" htmlFor="substance-cb">Lifestyle</label>
                    <p>
                        Select any of the answers below, if they apply to you.&nbsp;
                        <a className="text-primary" onClick={this.showSmokingModal}>Why?</a>
                    </p>
                    <div id="substance-cb" style={{ marginBottom: 20 }}>
                        <Checkbox
                            label="I regularly smoke tobacco products"
                            onChange={this.updateTobacco}
                            name="tobacco"
                        />
                        <Checkbox
                            label="I regularly use cannabis products"
                            onChange={this.updateCannabis}
                            name="cannabis"
                        />
                    </div>
                </div>
                <button onClick={this.submitPersonalInfo} className="button primary full"
                    disabled={birthday.length < 10 || bdError || sex === 'none'}>Continue</button>
            </div>
        );
    };
}

export default Store.withStore(Personal);
