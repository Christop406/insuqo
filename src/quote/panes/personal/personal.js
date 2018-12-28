import React, { Component } from 'react';
import Store from '../../../ApplicationStore';
import {Anchor, Box, Button, CheckBox, Heading, MaskedInput, Paragraph, RadioButton} from "grommet";

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    },
    sexButtons: {
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 5
    }
};

class Personal extends Component {

    state = {
        birthday: '',
        sex: 'none',
        tobacco: false,
        cannabis: false
    };

    updateBirthday = event => {
        console.log(event.target.value);
        this.setState({birthday: event.target.value});
    };

    updateSex = event => {
        this.setState({sex: event.target.name});
    };

    updateTobacco = () => {
        const { tobacco } = this.state;
        this.setState({tobacco: !tobacco});
    };

    updateCannabis = () => {
        const { cannabis } = this.state;
        this.setState({cannabis: !cannabis});
    };

    validateBirthdate = () => {
        // todo - implement
        return true;
    };

    submitPersonalInfo = () => {
        if(this.validateBirthdate()) {
            const store = this.props.store;
            const { birthday, sex, tobacco, cannabis } = this.state;
            store.set('birthdate')(birthday);
            store.set('sex')(sex);
            store.set('tobacco')(tobacco);
            store.set('cannabis')(cannabis);
            this.props.history.push("/quote/plan");
        }
    };

    render = () => {
        const store = this.props.store;
        const { birthday, sex, tobacco, cannabis } = this.state;
        return(
            <Box animation="fadeIn">
                <Heading margin="xsmall" level={1} color="#9c37f2">The weather's fine in {store.get('stateName') ? store.get('stateName') : 'XXXX'}!</Heading>
                <Heading margin="xsmall" style={styles.quoteSubtitle} color="dark-4" level={3}>(Because we've got you covered!)</Heading>
                <Paragraph style={{maxWidth: '600px'}} margin="small">
                    Before we can find quotes, we need to know a bit more about you as a person - let's start with your age and sex.
                </Paragraph>
                <Box margin="xsmall">
                    <Heading level={3} color="#9c37f2">Birthdate</Heading>
                    <Box style={{maxWidth: 300}}>
                        <MaskedInput
                            onChange={this.updateBirthday}
                            value={birthday}
                            mask={
                            [   {
                                    length: [1, 2],
                                    placeholder: '04',
                                    options: [
                                        "1",
                                        "2",
                                        "3",
                                        "4",
                                        "5",
                                        "6",
                                        "7",
                                        "8",
                                        "9",
                                        "10",
                                        "11",
                                        "12"
                                    ]
                                },
                                {
                                    fixed: '/'
                                },
                                {
                                    length: [1, 2],
                                    placeholder: '01',
                                    options: [
                                        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16",
                                        "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27","28","29","30","31"
                                    ]
                                },
                                {
                                    fixed: '/'
                                },
                                {
                                    length: 4,
                                    placeholder: '2000'
                                }]
                        } />
                    </Box>
                </Box>
                <Box margin="xsmall">
                    <Heading level={3} color="#9c37f2">Sex</Heading>
                    <Anchor style={{marginTop: -5}} color="dark-4" label="Why are there only two options?"/>
                    <Box style={styles.sexButtons}>
                        <RadioButton checked={sex === 'male'} onChange={this.updateSex} name="male" label="Male"/>
                        <span style={{height: '10px'}}/>
                        <RadioButton checked={sex === 'female'} onChange={this.updateSex} name="female" label="Female"/>
                    </Box>
                </Box>
                <Box margin="xsmall">
                    <Heading level={3} color="#9c37f2">Lifestyle</Heading>
                    <Paragraph style={{marginTop: -8, maxWidth: 'none'}}>
                        Select any of the answers below, if they apply to you.<Anchor margin="xsmall" label="Why?"/>
                    </Paragraph>
                    <Box style={{marginBottom: 20}} margin="xsmall">
                        <CheckBox onChange={this.updateTobacco} checked={tobacco} name="tobacco" label="I regularly smoke tobacco products."/>
                        <div style={{height: '10px', display: 'block'}}/>
                        <CheckBox onChange={this.updateCannabis} checked={cannabis} name="cannabis" label="I regularly use cannabis products."/>
                    </Box>
                </Box>
                <Button onClick={this.submitPersonalInfo} color="#9c37f2" label="Continue" primary disabled={birthday.length < 8 || sex === 'none'} />
            </Box>
        );
    };
}

export default Store.withStore(Personal);