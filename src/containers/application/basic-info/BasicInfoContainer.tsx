import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { Application } from '@insuqo/shared/types/application';
import BasicInfo from './components/BasicInfo';
import { ApplicationService } from 'services/application.service';

type BasicInfoContainerProps = RouteComponentProps & IQStoreProps;

class BasicInfoContainer extends React.Component<BasicInfoContainerProps> {

    private applicationService: ApplicationService;

    constructor(props: any) {
        super(props);
        this.applicationService = new ApplicationService();
    }

    componentDidMount = () => {
        document.title = 'Basic Info - Application | INSUQO';
    }

    public render() {
        const { store } = this.props;
        const application = store.get('application');
        const chosenQuote = store.get('chosenQuote');
        console.log(application);
        if (application && chosenQuote) {
            return <BasicInfo
                chosenQuote={chosenQuote}
                application={application}
                onSubmit={this.handleSubmit} />;
        }

        return <h1>Application Not Found</h1>;
    }

    private handleSubmit = async (app: Application) => {
        let application = this.props.store.get('application');
        application = { ...application, ...app };
        const res = await this.applicationService.updateApplication(application.id, application);
        this.props.store.set('application')(res);
        this.props.history.push(`/application/${application.id}/beneficiaries`);
    };
}

export default IQStore.withStore(withRouter(BasicInfoContainer));