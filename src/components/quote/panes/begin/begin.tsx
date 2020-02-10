import React, { Component, KeyboardEvent } from 'react';
import Store from '../../../../ApplicationStore';
import { localizeZip } from '../../../../api';
import { Store as S } from 'undux';
import { History, LocationState } from 'history';
import s from './begin.module.scss';
import Cleave from 'cleave.js/react';
import { Logger } from '../../../../services/logger';

interface IBeginProps {
    store: S<any>;
    history: History<LocationState>;
}

class Begin extends Component<IBeginProps> {

    state = {
        zipCode: '',
        readyToContinue: false,
        loading: false,
        zipInvalid: false,
        triedSubmit: false,
    };

    validateZipCode = (zipCode: string) => {
        const yes = /^[0-9]{5}(-[0-9]{4})?$/.test(zipCode);
        Logger.info(yes);
        return yes;
    };

    updateZipCode = (event: any) => {
        const value = typeof event === 'string' ? event : event.target.value;
        const { triedSubmit } = this.state;
        // Logger.log(this.validateZipCode(value));
        if (this.validateZipCode(value)) {
            this.setState({ readyToContinue: true, zipCode: value, zipInvalid: false });
        } else {
            this.setState({ readyToContinue: false, zipCode: value, zipInvalid: triedSubmit });
        }
    };

    submitZip = () => {
        const store = this.props.store;
        const { zipCode } = this.state;

        if (!this.validateZipCode(zipCode)) {
            this.updateZipCode(zipCode);
            return;
        }

        this.setState({ loading: true });
        localizeZip(zipCode).then(res => {
            if (res.data) {
                store.set('started')(true);
                store.set('zipCode')(zipCode);
                store.set('stateName')(res.data.data.stateName);
                store.set('stateCode')(res.data.data.stateCode);
                store.set('city')(res.data.data.cityName);

                this.props.history.push('/quote/personal');
            }
        }).catch((err) => {
            console.log(err);
            if (err.response.status === 400) {
                this.setState({ loading: false, zipInvalid: true });
            }
        });
    };

    handleKeyPress = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    };

    handleSubmit = () => {
        this.setState({ triedSubmit: true }, this.submitZip);
    };

    componentDidMount = () => {
        window.scrollTo({top: 0});
        const zip = localStorage.getItem('zipCode');
        if (zip != null && zip !== '') {
            this.setState({ zipCode: zip, readyToContinue: zip.length === 5 || zip.length === 9 });
        }
    };

    render = () => {
        const { readyToContinue, loading, zipInvalid } = this.state;
        return (
            <div style={{ maxWidth: 650 }}>
                <h1 className={s.paneHeader}>Looking for life insurance?</h1>
                <h2>You've come to the right place.</h2>
                <p>
                    Please begin by entering your ZIP code below, so we can get you the most accurate quotes.
                </p>
                <label htmlFor="zipCode">ZIP Code</label>
                <div style={{ marginBottom: 20 }}>
                    <Cleave
                        className="input"
                        name="zipCode"
                        placeholder="Enter Here"
                        style={{ borderColor: zipInvalid ? '#f03434' : undefined }}
                        options={{
                            blocks: [5, 4],
                            stripLeadingZeroes: false,
                            numericOnly: true,
                            delimiter: '-',
                            delimiterLazyShow: true,
                        }} onChange={this.updateZipCode} onKeyPress={this.handleKeyPress} />
                    {zipInvalid ? <span className={s.errorText}>ZIP code invalid, please try again.</span> : ''}
                </div>

                <button onClick={this.handleSubmit} color="#9c37f2" className="button full primary" style={{ maxHeight: 40 }}
                    disabled={!readyToContinue || (readyToContinue && loading)}>{loading ? 'Loading...' : 'Let\'s Get Started!'}</button>
            </div>
        );
    };
}

export default Store.withStore(Begin as any);
