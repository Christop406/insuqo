/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import Store from '../../../ApplicationStore';
import {Box, Button, Heading, MaskedInput, Paragraph} from "grommet";
import {localizeZip} from "../../../api";

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    }
};

class Begin extends Component {

    state = {
        zipCode: '',
        readyToContinue: false,
        loading: false
    };

    updateZipCode = event => {
        if(event.target.value.length < 5) {
            this.setState({readyToContinue: false, zipCode: event.target.value})
        } else {
            this.setState({readyToContinue: true, zipCode: event.target.value})
        }
    };

    submitZip = () => {
        const store = this.props.store;
        const { zipCode } = this.state;
        if(zipCode.length < 5) return;
        this.setState({loading: true});
        localizeZip(zipCode).then(res => {
            if(res.data) {
                store.set('started')(true);
                store.set('zipCode')(zipCode);
                store.set('stateName')(res.data.state);
                store.set('stateCode')(res.data.stateCode);
                store.set('city')(res.data.city);

                this.props.history.push('/quote/personal');
            }
        });
    };

    handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.submitZip();
        }
    };

    render = () => {
        const { zipCode, readyToContinue, loading } = this.state;
        return(
            <div>
                <Heading margin="xsmall" color="#9c37f2" level={1} >Looking for life insurance?</Heading>
                <Heading margin="xsmall" style={styles.quoteSubtitle} color="black" level={2}>You've come to the right place.</Heading>
                <Paragraph margin="small">
                    Please begin by entering your ZIP code below, so we can get you the most accurate quotes.
                </Paragraph>
                <Heading margin="xsmall" level={3} color="#9c37f2">ZIP Code</Heading>
                <Box style={{marginBottom: 20}} margin="xsmall">
                    <MaskedInput
                        value={zipCode}
                        onChange={this.updateZipCode}
                        onKeyPress={this.handleKeyPress}
                        mask={[
                            {
                                length: 5,
                                regexp: /^[0-9]{1,5}$/,
                                placeholder: "94041"
                            }
                        ]} />
                </Box>

                <Button onClick={this.submitZip} color="#9c37f2" fill style={{maxHeight: 40}} label="Let's Get Started!" primary disabled={!readyToContinue || (readyToContinue && loading)} />
            </div>
        );
    };
}

export default Store.withStore(Begin);