import React from 'react';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Results from './components/Results';
import { QuoteService } from '../../../services/quote.service';
import { PremiumMode, QuickTermQuoteResult, Quote } from '@insuqo/shared';
import { Auth } from '../../../services/firebase';
import ClientAuthentication from '../../../controllers/auth/ClientAuthentication';
import { Optional } from 'components/base/Optional';
import { ApplicationService } from 'services/application.service';

type ResultsContainerProps = IQStoreProps & RouteComponentProps;

interface ResultsContainerState {
    paymentFrequency: PremiumMode;
    loading: boolean;
    quoteRecord: Quote | undefined;
    quotes: QuickTermQuoteResult[];
    showAuthModal: boolean;
}

class ResultsContainer extends React.Component<ResultsContainerProps, ResultsContainerState> {
    state: ResultsContainerState = {
        paymentFrequency: PremiumMode.MONTHLY,
        loading: true,
        quotes: [],
        showAuthModal: false,
        quoteRecord: undefined,
    };

    private applicationService = new ApplicationService();
    private quoteService = new QuoteService();
    private selectedQuote?: QuickTermQuoteResult;

    componentDidMount = async () => {
        const { store } = this.props;

        try {
            const newQuotes = await this.getQuotes();
            this.setState({
                loading: false,
                quotes: newQuotes.data!.quotes,
                quoteRecord: store.get('quote'),
            });
            // this.props.history.push({ search: qs.stringify({ id: newQuotes.data?.key }) });
        } catch (error) {
            console.warn(error);
            throw error;
        }
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
        const app = await this.applicationService.createApplication(quote);
        if (app && app.id) {
            console.log(app);
            this.props.history.push(`/application/${app.id}/apply`);
        } else {
            console.log('err');
            throw new Error('There was an error creating the application');
        }
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
            console.log(this.selectedQuote);
        });
    };

    private handleAuthentication = async () => {
        this.setState({ showAuthModal: false });
        const { selectedQuote } = this;
        console.log(selectedQuote);

        if (selectedQuote) {
            await this.createApplication(selectedQuote);
        }
    };

    render = () => {
        const { loading, quotes, showAuthModal, quoteRecord } = this.state;
        return (
            <>
                <Results
                    loading={loading}
                    quote={quoteRecord}
                    quotes={quotes}
                    onApply={this.apply}
                />
                <Optional condition={showAuthModal}>
                    <ClientAuthentication type="signup" onAuthenticate={this.handleAuthentication} />
                </Optional>
            </>
        );
    }
}

export default IQStore.withStore(withRouter(ResultsContainer));