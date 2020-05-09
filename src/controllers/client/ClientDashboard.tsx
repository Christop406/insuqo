import React, { Component } from 'react';
import {getApplication} from '../../api';
import IQStore from 'store/IQStore';

interface IClientDashboardProps {
    client: any; // give this a type
}

class ClientDashboard extends Component<IClientDashboardProps> {

    componentDidMount = () => {
        if(this.props.client !== undefined && this.props.client.applicationId !== undefined) {
            getApplication(this.props.client.applicationId);
        }
    };

    render() {
        const { client } = this.props;
        return (
            <div>
                <h1>{client.fname} {client.lname}</h1>
                <div>uuid: {client.uuid}</div>
                <div>last login: {client.lastLogin}</div>

            </div>
        );
    }
}

export default IQStore.withStore(ClientDashboard as any); // get rid of undux for react context
