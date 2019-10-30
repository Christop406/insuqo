import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import { Store as S } from 'undux';

interface IAgentDashboardProps {
    store: S<any>;
}

class AgentDashboard extends Component<IAgentDashboardProps> {
    render() {
        return(
            <div>Agent Dashboard</div>
        );
    }
}

export default Store.withStore(AgentDashboard);
