import React, {Component} from 'react';
import Store from '../../ApplicationStore';
import qs from 'query-string';
import './status.scss';
import {Store as S} from 'undux';
import {RouteComponentProps} from 'react-router-dom';
import {ApplicationService} from '../../services/application.service';
import {ApplicationStatusView} from '../../components/application/ApplicationStatusView/ApplicationStatusView';
import {ApplicationStatus} from 'insuqo-shared';

declare type AppStatusProps = {
    store: S<any>;
} & RouteComponentProps<any>;

interface AppStatusState {
    id: string;
    loading: boolean;
    status: ApplicationStatus | undefined;
}

class AppStatus extends Component<AppStatusProps, AppStatusState> {

    private applicationService = new ApplicationService();

    state = {
        id: '',
        loading: true,
        status: undefined
    };

    render = (): JSX.Element => {
        const {loading, id, status} = this.state;
        return (
            loading ? <h1>loading...</h1> :
                <div className={'status-container'}>
                    <ApplicationStatusView status={status}/>
                </div>
        );
    };

    componentDidMount = async (): Promise<void> => {
        const query = qs.parse(this.props.location.search);
        if (query.id && typeof query.id === 'string') {
            const status = await this.applicationService.getStatus(query.id);
            this.setState({loading: false, id: query.id, status});
        }
    }
}

export default Store.withStore(AppStatus);
