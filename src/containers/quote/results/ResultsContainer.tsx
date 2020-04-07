import React from 'react';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Results from './components/Results';
import { ApplicationService } from '../../../services/application.service';
import { QuoteService } from '../../../services/quote.service';
import { PremiumMode, QuickTermQuoteResult } from '@insuqo/shared';
import { Auth } from '../../../services/firebase';
import { QuoteHelper } from '../../../util/quote-helper';
import qs from 'query-string';
import ClientAuthentication from '../../../controllers/auth/ClientAuthentication';
import { ZipCode } from '@insuqo/shared/types/zip-code';

type ResultsContainerProps = IQStoreProps & RouteComponentProps;

interface ResultsContainerState {
    paymentFrequency: PremiumMode;
    loading: boolean;
    quotes: QuickTermQuoteResult[];
    showAuthModal: boolean;
}

class ResultsContainer extends React.Component<ResultsContainerProps, ResultsContainerState> {
    state: ResultsContainerState = {
        paymentFrequency: PremiumMode.MONTHLY,
        loading: false,
        quotes: [],
        showAuthModal: false,
    };

    private applicationService = new ApplicationService();
    private quoteService = new QuoteService();
    private location?: ZipCode;
    private birthDate?: string;
    private selectedQuote?: QuickTermQuoteResult;

    componentDidMount = async () => {
        const { store } = this.props;

        try {
            const newQuotes = await this.getQuotes();
            this.setState({ loading: false, quotes: newQuotes.data!.quotes });
            this.props.history.push({ search: qs.stringify({ id: newQuotes.data?.key }) });
        } catch (error) {
            console.warn(error);
            throw error;
        }

        this.location = store.get('location');

        this.birthDate = store.get('quote')?.birthdate;
    };

    private getQuotes = () => {
        const quote = this.props.store.get('quote');
        if (quote) {
            return this.quoteService.runQuotes(quote.id);
        } else {
            throw new Error('No Quote in Store');
        }
    };

    private createApplication = async (quote: QuickTermQuoteResult) => {
        // const app = await this.applicationService.createApplication(quote.id, quote.RecID, this.birthDate!, this.location!);
        // if (app && app.id) {
        //     console.log(app);
        //     this.props.history.push(`/application/${app.id}/apply`);
        // } else {
        //     console.log('err');
        //     throw new Error('There was an error creating the application');
        // }
    };

    private apply = async (quote: QuickTermQuoteResult, event: any) => {
        event.preventDefault();
        Auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('logged in');
                await this.createApplication(quote);
            } else {
                console.log('logged OUT');
                this.selectedQuote = quote;
                this.setState({ showAuthModal: true });
            }
        });
    };

    private handleAuthentication = async () => {
        this.setState({ showAuthModal: false });
        const { selectedQuote } = this;

        if (selectedQuote) {
            await this.createApplication(selectedQuote);
        }
    };

    render = () => {
        const { loading, quotes, showAuthModal } = this.state;
        return (
            <>
                <Results
                    loading={loading}
                    quotes={quotes}
                    onApply={this.apply}
                />
                {showAuthModal &&
                    <ClientAuthentication type="signup" onAuthenticate={this.handleAuthentication} />}
            </>
        );
    }
}

export default IQStore.withStore(withRouter(ResultsContainer));