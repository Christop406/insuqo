import React, { Component } from 'react';
import Store from '../ApplicationStore';

class AgentDashboard extends Component {
    render() {
        return(
            <div>Agent Dashboard</div>
        );
    }
}

export default Store.withStore(AgentDashboard);
