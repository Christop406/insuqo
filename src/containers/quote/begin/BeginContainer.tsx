import React from 'react';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Begin from './components/Begin';
import { QuoteService } from 'services/quote.service';

type BeginContainerProps = IQStoreProps & RouteComponentProps;

interface BeginContainerState {
    triedSubmit: boolean;
    readyToContinue: boolean;
    zipCode: string | undefined;
    zipInvalid: boolean;
    loading: boolean;
}

class BeginContainer extends React.Component<BeginContainerProps, BeginContainerState> {

    state: BeginContainerState = {
        triedSubmit: false,
        loading: false,
        readyToContinue: false,
        zipCode: undefined,
        zipInvalid: false,
    };

    private quoteService: QuoteService;

    constructor(props: BeginContainerProps) {
        super(props);
        this.quoteService = new QuoteService();
    }

    private updateZipCode = (zipCode?: string) => {
        const { triedSubmit } = this.state;
        if (this.validateZipCode(zipCode)) {
            this.setState({ readyToContinue: true, zipCode, zipInvalid: false });
        } else {
            this.setState({ readyToContinue: false, zipCode, zipInvalid: triedSubmit });
        }
    };

    private validateZipCode = (zipCode?: string) => {
        return /^[0-9]{5}(-[0-9]{4})?$/.test(zipCode || '');
    }

    private submitZip = async () => {
        const { store, history } = this.props;
        const { zipCode } = this.state;

        if (!this.validateZipCode(zipCode)) {
            this.updateZipCode(zipCode);
            return;
        }

        this.setState({ loading: true, triedSubmit: true });
        try {
            if (!zipCode) {
                throw new Error('No ZIP Code Supplied');
            }
            const createRes = await this.quoteService.createQuoteRecord(zipCode);
            if (createRes) {
                const { location, quote } = createRes;
                store.set('quote')(quote);
                store.set('location')(location);
                history.push(`/quote/${quote.id}/personal`);
            } else {
                throw new Error('There was an error creating the quote record.');
            }
        } catch (err) {
            console.log(err);
            this.setState({ loading: false, zipInvalid: true });
        }
    }

    render = () => {
        const { loading, readyToContinue, zipInvalid } = this.state;
        return <Begin
            zipInvalid={zipInvalid}
            readyToContinue={readyToContinue}
            loading={loading}
            submitZip={this.submitZip}
            updateZipCode={this.updateZipCode} />;
    };
}

export default IQStore.withStore(withRouter(BeginContainer));