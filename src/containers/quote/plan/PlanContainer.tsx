import React from 'react';
import Plan from './components/Plan';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import IQStore, { IQStoreProps } from '../../../store/IQStore';

type PlanContainerProps = RouteComponentProps & IQStoreProps;

interface PlanContainerState {
    covAmount: number;
    termLength: number;
    rider: string;
}

class PlanContainer extends React.Component<PlanContainerProps, PlanContainerState> {

    state: PlanContainerState = {
        covAmount: 500000,
        termLength: 20,
        rider: 'none'
    };

    submitPlanInfo = () => {
        const store = this.props.store;
        const { covAmount, termLength, rider } = this.state;
        store.set('coverageAmount')(covAmount);
        store.set('termLength')(termLength);
        store.set('planRider')(rider);
        this.props.history.push('/quote/results');
    };

    updateCovAmount = (covAmount: number) => {
        this.setState({ covAmount });
    };

    updateTermLength = (termLength: number) => {
        this.setState({ termLength });
    };

    updateRider = (rider: string) => {
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