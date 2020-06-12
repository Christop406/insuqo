import React, { Component, KeyboardEvent } from 'react';
import s from './Begin.module.scss';
import Cleave from 'cleave.js/react';

interface BeginProps {
    updateZipCode: (zip?: string) => any;
    submitZip: () => any;
    loading: boolean;
    readyToContinue: boolean;
    zipInvalid: boolean;
}

class Begin extends Component<BeginProps> {

    handleKeyPress = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    };

    handleSubmit = () => {
        this.props.submitZip();
    };

    render = () => {
        const { loading, readyToContinue, zipInvalid, updateZipCode } = this.props;
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
                            blocks: [5],
                            stripLeadingZeroes: false,
                            numericOnly: true,
                            delimiterLazyShow: true,
                        }} onChange={(e) => updateZipCode(e.target.value)} onKeyPress={this.handleKeyPress} />
                    {zipInvalid ? <span className={s.errorText}>ZIP code invalid, please try again.</span> : ''}
                </div>

                <button onClick={this.handleSubmit} color="#9c37f2" className="button full primary" style={{ maxHeight: 40 }}
                    disabled={!readyToContinue || (readyToContinue && loading)}>{loading ? 'Loading...' : 'Let\'s Get Started!'}</button>
            </div>
        );
    };
}

export default Begin;
