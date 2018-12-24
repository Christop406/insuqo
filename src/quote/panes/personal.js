import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import {Anchor, Box, Button, FormField, Heading, MaskedInput, Paragraph, RadioButton} from "grommet";

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    },
    sexButtons: {
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 5
    }
};

class Personal extends Component {

    state = {
        birthday: '',
        sex: 'none'
    };

    updateBirthday = event => {
        console.log(event.target.value);
        this.setState({birthday: event.target.value});
    };

    updateSex = event => {
        this.setState({sex: event.target.name});
    };

    componentDidMount = () => {
        if(this.props.store) {
            if(this.props.store.state.started === false) {
                //this.props.history.push("/quote/begin");
            }
        }
    };

    render = () => {
        const store = this.props.store;
        const { birthday, sex } = this.state;
        return(
            <Box animation="fadeIn">
                <Heading margin="xsmall" level={1} color="#9c37f2">The weather's fine in {store.get('stateName') ? store.get('stateName') : 'XXXX'}!</Heading>
                <Heading margin="xsmall" style={styles.quoteSubtitle} color="dark-4" level={3}>(Because we've got you covered!)</Heading>
                <Paragraph margin="small">
                    Before we can find quotes, we need to know a bit more about you as a person - let's start with your age and sex.
                </Paragraph>
                <Heading margin="xsmall" level={3} color="#9c37f2">Birthdate</Heading>
                <MaskedInput
                    onChange={this.updateBirthday}
                    value={birthday}
                    mask={
                    [{
                        length: 2,
                        placeholder: '04'
                    },
                        {
                            fixed: '/'
                        },
                        {
                            length: 2,
                            placeholder: '01'
                        },
                        {
                            fixed: '/'
                        },
                        {
                            length: 4,
                            placeholder: '2000'
                        }]
                } />
                <Heading style={{marginTop: 10}} margin="xsmall" level={3} color="#9c37f2">Sex</Heading>
                <Anchor style={{marginTop: -5}} margin="xsmall" color="dark-4" label="Why are there only two options?"/>
                <Box style={styles.sexButtons}>
                    <RadioButton checked={sex === 'male'} onChange={this.updateSex} name="male" label="Male"/>
                    <span style={{height: '10px'}}/>
                    <RadioButton checked={sex === 'female'} onChange={this.updateSex} name="female" label="Female"/>
                </Box>
                <Button color="#9c37f2" fill label="Continue" primary />
            </Box>
        );
    };
}

export default Store.withStore(Personal);