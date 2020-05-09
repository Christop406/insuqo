import React from 'react';
import ApplicationStatusView from 'components/application/ApplicationStatusView/ApplicationStatusView';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { withRouter, RouteComponentProps } from 'react-router-dom';

type StatusContainerProps = RouteComponentProps & IQStoreProps;

class StatusContainer extends React.Component<StatusContainerProps> {
    render() {
        const application = this.props.store.get('application');
        return <>
            <ApplicationStatusView application={application}/>
        </>;
    }
}

export default IQStore.withStore(withRouter(StatusContainer));