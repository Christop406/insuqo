import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import {getApplication} from "../../api";

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
        let { client } = this.props;
        return (
            <div>
                <h1>{client.fname} {client.lname}</h1>
                <div>uuid: {client.uuid}</div>
                <div>last login: {client.lastLogin}</div>

            </div>
        );
    }
}

export default Store.withStore(ClientDashboard as any); // get rid of undux for react context
