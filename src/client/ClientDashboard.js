import React, { Component } from 'react';
import Store from '../ApplicationStore';

class ClientDashboard extends Component {
    render() {
        return (
            <div>
                Client Dashboard.
            </div>
        );
    }
}

export default Store.withStore(ClientDashboard);
