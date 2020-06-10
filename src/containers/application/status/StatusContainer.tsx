import React from 'react';
import ApplicationStatusView from 'containers/application/status/components/ApplicationStatusView/ApplicationStatusView';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ApplicationService } from 'services/application.service';
import { ApplicationActivityLogItem } from '@insuqo/shared/types/logging';

type StatusContainerProps = RouteComponentProps & IQStoreProps;

interface StatusContainerState {
    activityLog: ApplicationActivityLogItem[];
}

class StatusContainer extends React.Component<StatusContainerProps, StatusContainerState> {

    state: StatusContainerState = {
        activityLog: [],
    };

    private applicationService = new ApplicationService();

    public async componentDidMount(): Promise<void> {
        this.props.store.on('application').subscribe(async (a) => {
            if (a) {
                this.setState({
                    activityLog: await this.applicationService.getActivityLog(a.id),
                });
            }
        });
    }

    render() {
        const application = this.props.store.get('application');

        const { activityLog } = this.state;
        return <>
            <ApplicationStatusView activityLog={activityLog} application={application} />
        </>;
    }
}

export default IQStore.withStore(withRouter(StatusContainer));