import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import IQStore, { IQStoreProps } from 'store/IQStore';
import Beneficiaries from './components/Beneficiaries';
import { Beneficiary } from '@insuqo/shared';
import { ApplicationService } from 'services/application.service';

interface BeneficiariesContainerProps extends RouteComponentProps, IQStoreProps {

}

class BeneficiariesContainer extends React.Component<BeneficiariesContainerProps>  {

    private applicationService: ApplicationService;

    constructor(props: BeneficiariesContainerProps) {
        super(props);
        this.applicationService = new ApplicationService();
    }

    render = () => {
        const application = this.props.store.get('application');

        if (application) {
            return <Beneficiaries
                beneficiaries={application.beneficiaries}
                onSubmit={this.handleSubmit} />;
        }
        return <h1>No Application Found</h1>;
    };

    private handleSubmit = async (beneficiaries: Beneficiary[]) => {
        const application = this.props.store.get('application');
        const newApp = await this.applicationService.updateApplication(application!.id, { beneficiaries });
        this.props.store.set('application')(newApp);
        this.props.history.push(`/application/${application?.id}/payment`);
    };
}

export default IQStore.withStore(withRouter(BeneficiariesContainer));