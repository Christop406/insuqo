import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import ClientDashboard from './ClientDashboard';
import {Route, Switch, RouteComponentProps} from 'react-router-dom';
import {getUserInfo} from '../../api';
import constants from '../../util/constants.json';
import { Store as S } from 'undux';

declare type IClientProps = {
    store: S<any>;
} & RouteComponentProps<any>;

class Client extends Component<IClientProps> {

    state = {
        clientInfo: {}
    };

    componentDidMount() {
        getUserInfo(constants.userTypes.client).then(res => {
            if(res.status === 200) {
                res = res.data;
                this.setState({clientInfo: res.data.user});
            } else {
                this.props.history.push('/client/login');
            }
        });
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route component={(props: any) => <ClientDashboard {...props} client={this.state.clientInfo} />}/>
                </Switch>
            </div>
        );
    }
}

export default Store.withStore(Client);
