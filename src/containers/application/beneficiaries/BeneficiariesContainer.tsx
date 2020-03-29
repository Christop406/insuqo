import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import IQStore, { IQStoreProps } from 'store/IQStore';
import Beneficiaries from './components/Beneficiaries';
import { Beneficiary } from '../../../model/beneficiary';
import { ApplicationService } from 'services/application.service';
import { BeneficiaryService } from 'services/beneficiary.service';

interface BeneficiariesContainerProps extends RouteComponentProps, IQStoreProps {

}

class BeneficiariesContainer extends React.Component<BeneficiariesContainerProps>  {

    private beneficiaryService: BeneficiaryService;
    private applicationService: ApplicationService;

    constructor(props: BeneficiariesContainerProps) {
        super(props);
        this.beneficiaryService = new BeneficiaryService();
        this.applicationService = new ApplicationService();
    }

    componentDidMount = () => {
        document.title = 'Beneficiaries - Application | INSUQO';
        this.loadBeneficiaries();
    };

    private loadBeneficiaries = async () => {
        const application = this.props.store.get('application');
        if (application) {
            const beneficiaries = await this.beneficiaryService.getBeneficiaries(application.id);
            this.props.store.set('beneficiaries')(beneficiaries);
        }
    };

    render = () => {
        const application = this.props.store.get('application');
        const beneficiaries = this.props.store.get('beneficiaries');
        if (application) {
            return <Beneficiaries
                beneficiaries={beneficiaries}
                onSubmit={this.handleSubmit} />;
        }
        return <h1>No Application Found</h1>;
    };

    private handleSubmit = async (beneficiaries: Beneficiary[]) => {
        const { store, history } = this.props;
        const application = store.get('application');
        const bens = await this.beneficiaryService.updateBeneficiaries(application!.id, beneficiaries);
        store.set('beneficiaries')(bens);
        history.push(`/application/${application?.id}/payment`);
    };
}

export default IQStore.withStore(withRouter(BeneficiariesContainer));