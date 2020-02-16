import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import IQStore, { IQStoreProps } from 'store/IQStore';
import Beneficiaries from './components/Beneficiaries';
import { Application, Relationship } from '@insuqo/shared';

interface BeneficiariesContainerProps extends RouteComponentProps, IQStoreProps {

}

class BeneficiariesContainer extends React.Component<BeneficiariesContainerProps>  {
    render = () => {
        const application = this.props.store.get('application');

        if (application) {
            return <Beneficiaries
                application={application}
                beneficiaries={[
                    {
                        firstName: 'Chris', lastName: 'Gilardi',
                        relationship: Relationship.OTHER,
                        middleInitial: 'T',
                        suffix: 'Jr',
                        percentage: 10
                    },
                    {
                        firstName: 'Thomas', lastName: 'Gilardi',
                        relationship: Relationship.FATHER,
                        middleInitial: 'S',
                        suffix: '',
                        percentage: 20
                    },
                    {
                        firstName: 'Yvette', lastName: 'Gilardi',
                        relationship: Relationship.MOTHER,
                        middleInitial: 'M',
                        suffix: '',
                        percentage: 30
                    },
                    {
                        firstName: 'Yvette', lastName: 'Gilardi',
                        relationship: Relationship.MOTHER,
                        middleInitial: 'M',
                        suffix: '',
                        percentage: 15
                    },
                    {
                        firstName: 'Yvette', lastName: 'Gilardi',
                        relationship: Relationship.MOTHER,
                        middleInitial: 'M',
                        suffix: '',
                        percentage: 25
                    }
                ]}
                onSubmit={this.handleSubmit} />;
        }
        return <h1>No Application Found</h1>;
    };

    private handleSubmit = (app: Application) => {
        console.log(app);
    };
}

export default IQStore.withStore(withRouter(BeneficiariesContainer));