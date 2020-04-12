import React from 'react';
import Plan from './components/Plan';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
import { QuoteRider } from '@insuqo/shared';
import { QuoteService } from 'services/quote.service';

type PlanContainerProps = RouteComponentProps & IQStoreProps;

interface PlanContainerState {
    covAmount: number;
    termLength: number;
    rider: QuoteRider | undefined;
}

class PlanContainer extends React.Component<PlanContainerProps, PlanContainerState> {

    private quoteService: QuoteService;

    constructor(props: PlanContainerProps) {
        super(props);
        this.quoteService = new QuoteService();
    }

    state: PlanContainerState = {
        covAmount: 500000,
        termLength: 20,
        rider: undefined,
    };

    public componentDidMount(): void {
        const { quote } = this.props.store.getState();
        const { covAmount, termLength } = this.state;
        this.setState({
            covAmount: quote?.coverage || covAmount,
            termLength: quote?.termLength || termLength,
            rider: quote?.rider,
        });
    }

    submitPlanInfo = async () => {
        const store = this.props.store;
        const { covAmount, termLength, rider } = this.state;
        const currentQuote = store.get('quote');

        if (!currentQuote) {
            throw new Error('No quote to update');
        }

        const updatedQuote = await this.quoteService.updateQuoteRecord(currentQuote.id, {
            coverage: covAmount,
            termLength,
            rider,
        });

        store.set('quote')(updatedQuote);
        this.props.history.push(`/quote/${updatedQuote.id}/results`);
    };

    updateCovAmount = (covAmount: number) => {
        this.setState({ covAmount });
    };

    updateTermLength = (termLength: number) => {
        this.setState({ termLength });
    };

    updateRider = (rider: QuoteRider) => {
        console.log({ rider });
        this.setState({ rider });
    };

    render() {
        const { rider, covAmount, termLength } = this.state;
        return (
            <Plan
                rider={rider}
                coverageAmount={covAmount}
                termLength={termLength}
                onUpdateCoverage={this.updateCovAmount}
                onUpdateTermLength={this.updateTermLength}
                onUpdateRider={this.updateRider}
                onSubmit={this.submitPlanInfo} />
        );
    }
}

export default IQStore.withStore(withRouter(PlanContainer));