import React, {Component} from 'react';
import Store from '../../../../ApplicationStore';
import {Anchor, Box, Button, CheckBox, Heading, Paragraph, RadioButton, Text} from "grommet";
import Cleave from 'cleave.js/react'
import moment from "moment";
import {Modal} from "antd";
import SmokingPopover from "./smoking-popover";
import {Store as S} from 'undux';
import {History, LocationState} from 'history';

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
        bdErrMsg: "",
        sModalVisible: false
    };

    updateBirthday = (event: any) => {
        let bd = moment(event.target.value, "MM/DD/YYYY");
        let now = moment();
        let val = event.target.value;
        if (val.length > 8 && now.isBefore(bd)) {
            this.setState({birthday: val, bdError: true, bdErrMsg: "Please input a valid birthdate."});
        } else if (val.length > 8 && now.subtract(18, "years").isBefore(bd)) {
            this.setState({
                birthday: val,
                bdError: true,
                bdErrMsg: "You must be 18 years or older to use this service."
            });
        } else {
            this.setState({birthday: val, bdError: false, bdErrMsg: ""});
        }
    };

    updateSex = (event: any) => {
        this.setState({sex: event.target.name});
    };

    updateTobacco = () => {
        const {tobacco} = this.state;
        this.setState({tobacco: !tobacco});
    };

    updateCannabis = () => {
        const {cannabis} = this.state;
        this.setState({cannabis: !cannabis});
    };

    validateBirthdate = () => {
        // todo - implement
        return true;
    };

    showSmokingModal = () => {
        Modal.info({
            title: 'Why we need your smoking habits',
            centered: true,
            content: <SmokingPopover/>
        });
    };

    showGenderModal = () => {
        Modal.info({
                title: 'Why can I only choose male or female?',
                centered: true,
                content: <Text>For insurance purposes, and estimation of quotes,
                    we can only use either male or female. If you do not identify as
                    male or female, please use your sex at birth instead.</Text>
            }
        );
    };

    //hideSmokingModal = () => {this.setState({sModalVisible: false});};

    submitPersonalInfo = () => {
        if (this.validateBirthdate()) {
            const store = this.props.store;
            const {birthday, sex, tobacco, cannabis} = this.state;
            store.set('birthdate')(moment(birthday, 'MM/DD/YYYY').format('YYYY-MM-DD'));
            store.set('sex')(sex);
            store.set('tobacco')(tobacco);
            store.set('cannabis')(cannabis);
            this.props.history.push("/quote/plan");
        }
    };

    componentDidMount = () => {
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

        this.setState({birthday: bd, sex: sex, tobacco: tob, cannabis: can});

    };

    render = () => {
        const store = this.props.store;
        const {birthday, sex, tobacco, cannabis, bdError, bdErrMsg} = this.state;
        return (
            <Box animation="fadeIn">
                <Heading margin="xsmall" level={1} color="#9c37f2">The weather's fine
                    in {store.get('stateName') ? store.get('stateName') : 'XXXX'}!</Heading>
                <Heading margin="xsmall" style={styles.quoteSubtitle} color="dark-4" level={3}>(Because we've got you
                    covered!)</Heading>
                <Paragraph style={{maxWidth: '600px'}} margin="small">
                    Before we can find quotes, we need to know a bit more about you as a person - let's start with your
                    age and sex.
                </Paragraph>
                <Box margin="xsmall">
                    <Heading level={3} color="#9c37f2">Birthdate</Heading>
                    <Box style={{maxWidth: 300}}>
                        <Cleave
                            style={{borderColor: bdError ? '#f03434' : undefined}}
                            placeholder="12/21/1997"
                            className="input"
                            options={{date: true, datePattern: ['m', 'd', 'Y']}}
                            onChange={this.updateBirthday}
                            value={birthday}
                        />
                    </Box>
                    {bdError ? <Text color="#f03434">{bdErrMsg}</Text> : ""}
                </Box>
                <Box margin="xsmall">
                    <Heading level={3} color="#9c37f2">Sex</Heading>
                    <Anchor style={{marginTop: -5}} color="dark-4" onClick={this.showGenderModal}
                            label="Why are there only two options?"/>
                    <Box style={styles.sexButtons}>
                        <RadioButton checked={sex === 'male'} onChange={this.updateSex} name="male" label="Male"/>
                        <span style={{height: '10px'}}/>
                        <RadioButton checked={sex === 'female'} onChange={this.updateSex} name="female" label="Female"/>
                    </Box>
                </Box>
                <Box margin="xsmall">
                    <Heading level={3} color="#9c37f2">Lifestyle</Heading>
                    <Paragraph style={{marginTop: -8, maxWidth: 'none'}}>
                        Select any of the answers below, if they apply to you.
                        <Anchor margin="xsmall" label="Why?" onClick={this.showSmokingModal}/>
                    </Paragraph>
                    <Box style={{marginBottom: 20}} margin="xsmall">
                        <CheckBox onChange={this.updateTobacco} checked={tobacco} name="tobacco"
                                  label="I regularly smoke tobacco products."/>
                        <div style={{height: '10px', display: 'block'}}/>
                        <CheckBox onChange={this.updateCannabis} checked={cannabis} name="cannabis"
                                  label="I regularly use cannabis products."/>
                    </Box>
                </Box>
                <Button onClick={this.submitPersonalInfo} color="#9c37f2" label="Continue" primary
                        disabled={birthday.length < 10 || bdError || sex === 'none'}/>
            </Box>
        );
    };
}

export default Store.withStore(Personal);
