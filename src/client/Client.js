import React, { Component } from 'react';
import Store from '../ApplicationStore';
import ClientDashboard from "./ClientDashboard";

class Client extends Component {
    render() {
        return (
            <div>
                <ClientDashboard/>
            </div>
        );
    }
}

export default Store.withStore(Client);
