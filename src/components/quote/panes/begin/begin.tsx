/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, KeyboardEvent } from 'react';
import Store from '../../../../ApplicationStore';
import { Button, Heading, MaskedInput, Paragraph, Text } from "grommet";
import { localizeZip } from "../../../../api";
import { Store as S } from 'undux';
import { History, LocationState } from 'history';
import s from './begin.module.scss';

interface IBeginProps {
    store: S<any>;
    history: History<LocationState>;
}

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    }
};

class Begin extends Component<IBeginProps> {

    state = {
        zipCode: '',
        readyToContinue: false,
        loading: false,
        zipInvalid: false
    };

    updateZipCode = (event: any) => {
        if (event.target.value.length < 5) {
            this.setState({ readyToContinue: false, zipCode: event.target.value, zipInvalid: false })
        } else {
            this.setState({ readyToContinue: true, zipCode: event.target.value, zipInvalid: false })
        }
    };

    submitZip = () => {
        const store = this.props.store;
        const { zipCode } = this.state;
        let that = this;
        if (zipCode.length < 5) return;
        this.setState({ loading: true });
        localizeZip(zipCode).then(res => {
            if (res.data) {
                store.set('started')(true);
                store.set('zipCode')(zipCode);
                store.set('stateName')(res.data.stateName);
                store.set('stateCode')(res.data.stateCode);
                store.set('city')(res.data.cityName);

                that.props.history.push('/quote/personal');
            }
        }).catch((err) => {
            if (err.response.status === 400) {
                that.setState({ loading: false, zipInvalid: true });
            }
        });
    };

    handleKeyPress = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            this.submitZip();
        }
    };

    componentDidMount = () => {
        const zip = localStorage.getItem("zipCode");
        if (zip != null && zip !== '') {
            this.setState({ zipCode: zip, readyToContinue: zip.length === 5 });
        }
    };

    render = () => {
        const { zipCode, readyToContinue, loading, zipInvalid } = this.state;
        return (
            <div style={{ maxWidth: 650 }}>
                <Heading margin="xsmall" color="#9c37f2" level={1}>Looking for life insurance?</Heading>
                <Heading margin="xsmall" style={styles.quoteSubtitle} color="black" level={2}>You've come to the right
                    place.</Heading>
                <Paragraph margin="small">
                    Please begin by entering your ZIP code below, so we can get you the most accurate quotes.
                </Paragraph>
                <Heading margin="xsmall" level={3} color="#9c37f2">ZIP Code</Heading>
                <div style={{ marginBottom: 20 }}>
                    <MaskedInput
                        value={zipCode}
                        onChange={this.updateZipCode}
                        onKeyPress={this.handleKeyPress}
                        className="input"
                        style={{ borderColor: zipInvalid ? '#f03434' : undefined }}
                        mask={[
                            {
                                length: 5,
                                regexp: /^[0-9]{1,5}$/,
                                placeholder: "94041"
                            }
                        ]} />
                    {zipInvalid ? <Text color="#f03434">ZIP code invalid, please try again.</Text> : ""}
                    <div className={s.attributionContainer}>
                        <img alt="Powered by Google logo"
                            src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png" />
                    </div>
                </div>

                <Button onClick={this.submitZip} color="#9c37f2" fill style={{ maxHeight: 40 }}
                    label={loading ? "Loading..." : "Let's Get Started!"} primary
                    disabled={!readyToContinue || (readyToContinue && loading)} />
            </div>
        );
    };
}

export default Store.withStore(Begin as any);
