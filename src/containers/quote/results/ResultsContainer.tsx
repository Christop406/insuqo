import React from 'react';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Results from './components/Results';
import { ApplicationService } from '../../../services/application.service';
import { QuoteService } from '../../../services/quote.service';
import dayjs from 'dayjs';
import { PremiumMode, Address, QuickTermQuoteResult } from '@insuqo/shared';
import { Auth } from '../../../services/firebase';
import { QuoteHelper } from '../../../util/quote-helper';
import qs from 'query-string';
import ClientAuthentication from '../../../controllers/auth/ClientAuthentication';

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
    private location: Partial<Address> = {};
    private birthDate?: string;
    private selectedQuote?: QuickTermQuoteResult;

    componentDidMount = async () => {
        const { store } = this.props;
        const { paymentFrequency } = this.state;
        const { search } = this.props.history.location;
        if (search) {
            const query = qs.parse(search.slice(1), {});
            console.log(query);
            if (query.id) {
                query.id = Array.isArray(query.id) ? query.id[0] : query.id;
                const retrievedQuotes = await this.quoteService.getQuotesByKey(query.id);
                retrievedQuotes?.sort((a, b) => QuoteHelper.quoteSortValue(a, b, paymentFrequency));
                if (retrievedQuotes) {
                    this.setState({ loading: false, quotes: retrievedQuotes });
                    return;
                } else {
                    this.props.history.push({ search: '' });
                }
            }
        }

        try {
            const newQuotes = await this.getQuotes();
            this.setState({ loading: false, quotes: newQuotes.data!.quotes });
            this.props.history.push({ search: qs.stringify({ id: newQuotes.data?.key }) });
        } catch (error) {
            console.warn(error);
            throw error;
        }

        this.location = {
            city: store.get('city'),
            state: store.get('stateCode'),
            zipCode: store.get('zipCode')
        };

        this.birthDate = store.get('birthDate');
    };

    private getQuotes = () => {
        const store = this.props.store;
        const stateCode = store.get('stateCode');
        const birthdate = store.get('birthDate');
        const sex = store.get('sex');
        const covAmount = store.get('coverageAmount');
        const termLength = store.get('termLength');
        const rider = store.get('planRider');

        const now = dayjs();
        const birthTime = dayjs(birthdate, 'YYYY-MM-DD');
        const actualAge = now.diff(birthTime, 'year');
        const nearestAge = Math.round(now.diff(birthTime, 'year', true));

        const tobacco = store.get('tobacco');
        const cannabis = store.get('cannabis');
        const healthType = tobacco || cannabis ? 'preferred_smoker' : 'preferred_non_smoker';

        return this.quoteService.runQuotes(stateCode, actualAge, nearestAge, covAmount, termLength, healthType, sex, rider, 10);
    };

    private createApplication = async (quote: QuickTermQuoteResult) => {
        console.log('creating');
        const app = await this.applicationService.createApplication(quote.id, quote.RecID, this.birthDate!, this.location!);
        console.log('created?');
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